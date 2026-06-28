export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate the Google OAuth login URL at runtime so the redirect URI reflects
// the current origin. The callback (/api/oauth/callback) exchanges the code.
export const getLoginUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", clientId || "");
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", state);
    url.searchParams.set("access_type", "online");
    url.searchParams.set("prompt", "select_account");
    return url.toString();
  } catch (err) {
    console.error("Invalid Google OAuth config", err);
    return "#";
  }
};
