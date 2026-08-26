// ============================================================
// BEZMASAJIDLA.CZ — Production Database Migration & Schema Verification
// Verifies and auto-applies publicationId UNIQUE index and omniforgeWebhookEvents table.
// ============================================================

import { getDb } from "../db";
import { sql } from "drizzle-orm";

export interface MigrationVerificationReport {
  socialPostsPublicationIdColumn: boolean;
  socialPostsPublicationIdUniqueIndex: boolean;
  omniforgeWebhookEventsTable: boolean;
  omniforgeWebhookEventsProcessingStatusColumn: boolean;
  omniforgeWebhookEventsProcessingStartedAtColumn: boolean;
  migrationApplied: boolean;
  timestamp: string;
}

export async function verifyAndApplyOmniForgeMigrations(): Promise<MigrationVerificationReport> {
  const db = await getDb();
  const timestamp = new Date().toISOString();

  const report: MigrationVerificationReport = {
    socialPostsPublicationIdColumn: false,
    socialPostsPublicationIdUniqueIndex: false,
    omniforgeWebhookEventsTable: false,
    omniforgeWebhookEventsProcessingStatusColumn: false,
    omniforgeWebhookEventsProcessingStartedAtColumn: false,
    migrationApplied: false,
    timestamp,
  };

  if (!db) {
    console.warn("[DB Migration Check] DATABASE_URL not set or DB disconnected. Operating in schema-defined fallback.");
    return report;
  }

  try {
    // 1. Check & add socialPosts.publicationId column + UNIQUE index
    const [columns]: any = await db.execute(sql`SHOW COLUMNS FROM socialPosts LIKE 'publicationId'`);
    if (Array.isArray(columns) && columns.length > 0) {
      report.socialPostsPublicationIdColumn = true;
    } else {
      await db.execute(sql`ALTER TABLE socialPosts ADD COLUMN publicationId VARCHAR(128) NULL`);
      report.socialPostsPublicationIdColumn = true;
      report.migrationApplied = true;
    }

    const [indexes]: any = await db.execute(sql`SHOW INDEX FROM socialPosts WHERE Column_name = 'publicationId'`);
    if (Array.isArray(indexes) && indexes.length > 0) {
      report.socialPostsPublicationIdUniqueIndex = true;
    } else {
      try {
        await db.execute(sql`CREATE UNIQUE INDEX socialPosts_publicationId_unique_idx ON socialPosts (publicationId)`);
        report.socialPostsPublicationIdUniqueIndex = true;
        report.migrationApplied = true;
      } catch (err: any) {
        // Fallback to non-unique index if duplicate values exist in legacy data
        await db.execute(sql`CREATE INDEX socialPosts_publicationId_idx ON socialPosts (publicationId)`);
        report.socialPostsPublicationIdUniqueIndex = false;
      }
    }

    // 2. Check & create omniforgeWebhookEvents table
    const [tables]: any = await db.execute(sql`SHOW TABLES LIKE 'omniforgeWebhookEvents'`);
    if (Array.isArray(tables) && tables.length > 0) {
      report.omniforgeWebhookEventsTable = true;
    } else {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS omniforgeWebhookEvents (
          eventId VARCHAR(128) PRIMARY KEY,
          publicationId VARCHAR(128) NULL,
          eventType VARCHAR(64) NOT NULL,
          payloadHash VARCHAR(64) NULL,
          processingStatus ENUM('received', 'processing', 'processed', 'failed') NOT NULL DEFAULT 'received',
          processingStartedAt DATETIME NULL,
          lastError TEXT NULL,
          receivedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          processedAt DATETIME NULL,
          INDEX omniforgeWebhookEvents_publicationId_idx (publicationId),
          INDEX omniforgeWebhookEvents_receivedAt_idx (receivedAt),
          INDEX omniforgeWebhookEvents_status_idx (processingStatus)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      report.omniforgeWebhookEventsTable = true;
      report.migrationApplied = true;
    }

    // 3. Check specific processingStatus and processingStartedAt columns
    const [whColumns]: any = await db.execute(sql`SHOW COLUMNS FROM omniforgeWebhookEvents`);
    if (Array.isArray(whColumns)) {
      const colNames = whColumns.map((c: any) => c.Field || c.field);
      report.omniforgeWebhookEventsProcessingStatusColumn = colNames.includes("processingStatus");
      report.omniforgeWebhookEventsProcessingStartedAtColumn = colNames.includes("processingStartedAt");

      if (!report.omniforgeWebhookEventsProcessingStatusColumn) {
        await db.execute(sql`ALTER TABLE omniforgeWebhookEvents ADD COLUMN processingStatus ENUM('received', 'processing', 'processed', 'failed') NOT NULL DEFAULT 'received'`);
        report.omniforgeWebhookEventsProcessingStatusColumn = true;
        report.migrationApplied = true;
      }
      if (!report.omniforgeWebhookEventsProcessingStartedAtColumn) {
        await db.execute(sql`ALTER TABLE omniforgeWebhookEvents ADD COLUMN processingStartedAt DATETIME NULL`);
        report.omniforgeWebhookEventsProcessingStartedAtColumn = true;
        report.migrationApplied = true;
      }
    }
  } catch (err) {
    console.error("[DB Migration Verification Error]", err);
  }

  return report;
}
