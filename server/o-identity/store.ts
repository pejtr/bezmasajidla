import { and, desc, eq } from "drizzle-orm";
import {
  domainIdentities,
  favorites,
  identityAuditEvents,
  identityLinks,
  oIdentities,
  userInteractions,
  vegProfiles,
} from "../../drizzle/schema";
import type { User } from "../../drizzle/schema";
import { getDb } from "../db";
import { createDomainSubjectId, createUuidV7 } from "./id";

export const VEG_DOMAIN = "veg" as const;
const LEGACY_PROVIDER = "bezmasajidla_user";

type InteractionTarget = "recipe" | "venue" | "article" | "product";
type InteractionAction =
  | "favorite"
  | "want_to_visit"
  | "visited"
  | "want_to_cook"
  | "cooked"
  | "saved";

function isDuplicateEntry(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ER_DUP_ENTRY",
  );
}

async function loadExistingIdentity(user: Pick<User, "id" | "openId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const providerSubject = user.openId;
  const links = await db
    .select()
    .from(identityLinks)
    .where(
      and(
        eq(identityLinks.provider, LEGACY_PROVIDER),
        eq(identityLinks.providerSubject, providerSubject),
      ),
    )
    .limit(1);

  if (links.length === 0) return null;

  const domains = await db
    .select()
    .from(domainIdentities)
    .where(
      and(
        eq(domainIdentities.oIdentityId, links[0].oIdentityId),
        eq(domainIdentities.domain, VEG_DOMAIN),
      ),
    )
    .limit(1);

  if (domains.length === 0) return null;

  return {
    oIdentityId: links[0].oIdentityId,
    vegSubjectId: domains[0].subjectId,
  };
}

async function mirrorLegacyFavorites(userId: number, vegSubjectId: string) {
  const db = await getDb();
  if (!db) return;

  const legacyFavorites = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId));

  for (const favorite of legacyFavorites) {
    try {
      await db.insert(userInteractions).values({
        id: createUuidV7(),
        subjectId: vegSubjectId,
        targetType: favorite.itemType === "restaurant" ? "venue" : "recipe",
        targetId: favorite.itemSlug,
        action: "favorite",
        createdAt: favorite.createdAt,
      });
    } catch (error) {
      if (!isDuplicateEntry(error)) throw error;
    }
  }
}

/**
 * Lazily links a legacy BezmasáJídla account to the new o_ID root and creates
 * its pairwise vegID projection. Existing users keep their current login.
 *
 * Root o_ID is intentionally not returned by the public router.
 */
export async function ensureVegIdentityForUser(
  user: Pick<User, "id" | "name" | "openId">,
) {
  const existing = await loadExistingIdentity(user);
  if (existing) {
    return existing;
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const oIdentityId = createUuidV7();
  const vegSubjectId = createDomainSubjectId(VEG_DOMAIN);

  try {
    await db.transaction(async tx => {
      await tx.insert(oIdentities).values({
        id: oIdentityId,
        entityType: "person",
        status: "active",
      });

      await tx.insert(identityLinks).values({
        oIdentityId,
        provider: LEGACY_PROVIDER,
        providerSubject: user.openId,
      });

      await tx.insert(domainIdentities).values({
        subjectId: vegSubjectId,
        oIdentityId,
        domain: VEG_DOMAIN,
        visibility: "private",
      });

      await tx.insert(vegProfiles).values({
        subjectId: vegSubjectId,
        displayName: user.name ?? null,
        profileVisibility: "private",
      });

      await tx.insert(identityAuditEvents).values({
        id: createUuidV7(),
        oIdentityId,
        actorSubjectId: vegSubjectId,
        eventType: "identity.bootstrap",
        metadata: JSON.stringify({
          provider: LEGACY_PROVIDER,
          domain: VEG_DOMAIN,
        }),
      });
    });
  } catch (error) {
    if (!isDuplicateEntry(error)) throw error;

    const raced = await loadExistingIdentity(user);
    if (!raced) throw error;
    return raced;
  }

  await mirrorLegacyFavorites(user.id, vegSubjectId);

  return { oIdentityId, vegSubjectId };
}

export async function getVegProfileForUser(user: Pick<User, "id" | "name" | "openId">) {
  const identity = await ensureVegIdentityForUser(user);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(vegProfiles)
    .where(eq(vegProfiles.subjectId, identity.vegSubjectId))
    .limit(1);

  return {
    subjectId: identity.vegSubjectId,
    profile: rows[0] ?? null,
  };
}

export async function updateVegProfileForUser(
  user: Pick<User, "id" | "name" | "openId">,
  input: {
    displayName?: string | null;
    publicHandle?: string | null;
    dietStyle?: "vegan" | "vegetarian" | "flexitarian" | "plant-curious" | "other" | null;
    favoriteCuisines?: string[];
    profileVisibility?: "private" | "public";
  },
) {
  const identity = await ensureVegIdentityForUser(user);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const values = {
    ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
    ...(input.publicHandle !== undefined ? { publicHandle: input.publicHandle } : {}),
    ...(input.dietStyle !== undefined ? { dietStyle: input.dietStyle } : {}),
    ...(input.favoriteCuisines !== undefined
      ? { favoriteCuisines: JSON.stringify(input.favoriteCuisines) }
      : {}),
    ...(input.profileVisibility !== undefined
      ? { profileVisibility: input.profileVisibility }
      : {}),
  };

  if (Object.keys(values).length > 0) {
    await db
      .update(vegProfiles)
      .set(values)
      .where(eq(vegProfiles.subjectId, identity.vegSubjectId));
  }

  return getVegProfileForUser(user);
}

export async function listInteractionsForUser(
  user: Pick<User, "id" | "name" | "openId">,
  filters?: {
    targetType?: InteractionTarget;
    action?: InteractionAction;
  },
) {
  const identity = await ensureVegIdentityForUser(user);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const clauses = [eq(userInteractions.subjectId, identity.vegSubjectId)];
  if (filters?.targetType) {
    clauses.push(eq(userInteractions.targetType, filters.targetType));
  }
  if (filters?.action) {
    clauses.push(eq(userInteractions.action, filters.action));
  }

  return db
    .select()
    .from(userInteractions)
    .where(and(...clauses))
    .orderBy(desc(userInteractions.createdAt));
}

export async function setInteractionForUser(
  user: Pick<User, "id" | "name" | "openId">,
  input: {
    targetType: InteractionTarget;
    targetId: string;
    action: InteractionAction;
    active: boolean;
  },
) {
  const identity = await ensureVegIdentityForUser(user);
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const where = and(
    eq(userInteractions.subjectId, identity.vegSubjectId),
    eq(userInteractions.targetType, input.targetType),
    eq(userInteractions.targetId, input.targetId),
    eq(userInteractions.action, input.action),
  );

  if (!input.active) {
    await db.delete(userInteractions).where(where);
    return { active: false };
  }

  try {
    await db.insert(userInteractions).values({
      id: createUuidV7(),
      subjectId: identity.vegSubjectId,
      targetType: input.targetType,
      targetId: input.targetId,
      action: input.action,
    });
  } catch (error) {
    if (!isDuplicateEntry(error)) throw error;
  }

  return { active: true };
}
