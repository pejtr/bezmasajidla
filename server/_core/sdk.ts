import { AXIOS_TIMEOUT_MS, COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// Utility function
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

// --- OAuth provider response shapes (Google) ---
type TokenResponse = {
  accessToken: string;
};

type UserInfo = {
  openId: string;
  name: string;
  email: string | null;
  loginMethod: string;
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

/**
 * Google OAuth2 provider. Exchanges authorization codes for access tokens and
 * resolves the authenticated Google profile (replaces the former Manus WebDev
 * auth service — the session handling below stays provider-agnostic).
 */
class GoogleOAuthService {
  private decodeState(state: string): string {
    // state carries the base64-encoded redirect URI used to start the flow
    return atob(state);
  }

  async getTokenByCode(code: string, state: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      client_id: ENV.googleClientId,
      client_secret: ENV.googleClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: this.decodeState(state),
    });

    const { data } = await axios.post<{ access_token?: string }>(
      GOOGLE_TOKEN_URL,
      body.toString(),
      {
        timeout: AXIOS_TIMEOUT_MS,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (!isNonEmptyString(data.access_token)) {
      throw new Error("Google token response missing access_token");
    }
    return { accessToken: data.access_token };
  }

  async getUserInfoByToken(accessToken: string): Promise<UserInfo> {
    const { data } = await axios.get<{
      sub?: string;
      name?: string;
      email?: string;
    }>(GOOGLE_USERINFO_URL, {
      timeout: AXIOS_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!isNonEmptyString(data.sub)) {
      throw new Error("Google userinfo response missing sub");
    }
    return {
      openId: data.sub,
      name: data.name ?? "",
      email: data.email ?? null,
      loginMethod: "google",
    };
  }
}

class SDKServer {
  private readonly oauthService: GoogleOAuthService;

  constructor() {
    this.oauthService = new GoogleOAuthService();
    if (!ENV.googleClientId || !ENV.googleClientSecret) {
      console.error(
        "[OAuth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not configured — login will fail."
      );
    }
  }

  /**
   * Exchange OAuth authorization code for an access token.
   * @example const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(
    code: string,
    state: string
  ): Promise<TokenResponse> {
    return this.oauthService.getTokenByCode(code, state);
  }

  /**
   * Resolve the authenticated profile from an access token.
   * @example const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken: string): Promise<UserInfo> {
    return this.oauthService.getUserInfoByToken(accessToken);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  /**
   * Create a signed session token for an authenticated user openId.
   * @example const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(openId) ||
        !isNonEmptyString(appId) ||
        !isNonEmptyString(name)
      ) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return {
        openId,
        appId,
        name,
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const signedInAt = new Date();
    let user = await db.getUserByOpenId(session.openId);

    // Session is valid but the user row is missing (e.g. fresh/wiped DB) —
    // recreate it from the verified session payload, no external call needed.
    if (!user) {
      await db.upsertUser({
        openId: session.openId,
        name: session.name || null,
        lastSignedIn: signedInAt,
      });
      user = await db.getUserByOpenId(session.openId);
    }

    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt,
    });

    return user;
  }
}

export const sdk = new SDKServer();
