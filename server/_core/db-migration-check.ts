// ============================================================
// BEZMASAJIDLA.CZ — Production Database Migration & Schema Verification
// Read-only schema verifier for production runtime + DDL script runner for deployment steps.
// ============================================================

import { getDb } from "../db";
import { sql } from "drizzle-orm";

export interface MigrationVerificationReport {
  socialPostsPublicationIdColumn: boolean;
  socialPostsPublicationIdUniqueIndex: boolean;
  omniforgeWebhookEventsTable: boolean;
  omniforgeWebhookEventsProcessingStatusColumn: boolean;
  omniforgeWebhookEventsProcessingStartedAtColumn: boolean;
  allChecksPassed: boolean;
  timestamp: string;
}

/**
 * READ-ONLY schema verifier for production runtime (performs NO DDL ALTER/CREATE statements)
 */
export async function verifyOmniForgeMigrationsReadOnly(): Promise<MigrationVerificationReport> {
  const db = await getDb();
  const timestamp = new Date().toISOString();

  const report: MigrationVerificationReport = {
    socialPostsPublicationIdColumn: false,
    socialPostsPublicationIdUniqueIndex: false,
    omniforgeWebhookEventsTable: false,
    omniforgeWebhookEventsProcessingStatusColumn: false,
    omniforgeWebhookEventsProcessingStartedAtColumn: false,
    allChecksPassed: false,
    timestamp,
  };

  if (!db) {
    return report;
  }

  try {
    // 1. Check socialPosts.publicationId column
    const [columns]: any = await db.execute(sql`SHOW COLUMNS FROM socialPosts LIKE 'publicationId'`);
    if (Array.isArray(columns) && columns.length > 0) {
      report.socialPostsPublicationIdColumn = true;
    }

    // Check publicationId index
    const [indexes]: any = await db.execute(sql`SHOW INDEX FROM socialPosts WHERE Column_name = 'publicationId'`);
    if (Array.isArray(indexes) && indexes.length > 0) {
      report.socialPostsPublicationIdUniqueIndex = true;
    }

    // 2. Check omniforgeWebhookEvents table
    const [tables]: any = await db.execute(sql`SHOW TABLES LIKE 'omniforgeWebhookEvents'`);
    if (Array.isArray(tables) && tables.length > 0) {
      report.omniforgeWebhookEventsTable = true;

      const [whColumns]: any = await db.execute(sql`SHOW COLUMNS FROM omniforgeWebhookEvents`);
      if (Array.isArray(whColumns)) {
        const colNames = whColumns.map((c: any) => c.Field || c.field);
        report.omniforgeWebhookEventsProcessingStatusColumn = colNames.includes("processingStatus");
        report.omniforgeWebhookEventsProcessingStartedAtColumn = colNames.includes("processingStartedAt");
      }
    }

    report.allChecksPassed =
      report.socialPostsPublicationIdColumn &&
      report.socialPostsPublicationIdUniqueIndex &&
      report.omniforgeWebhookEventsTable &&
      report.omniforgeWebhookEventsProcessingStatusColumn &&
      report.omniforgeWebhookEventsProcessingStartedAtColumn;
  } catch (err) {
    console.error("[DB Read-Only Verification Error]", err);
  }

  return report;
}

/**
 * Standalone DDL Migration Script runner (for deployment pipeline steps)
 */
export async function applyOmniForgeMigrationsDDL(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`ALTER TABLE socialPosts ADD COLUMN IF NOT EXISTS publicationId VARCHAR(128) NULL`);
    try {
      await db.execute(sql`CREATE UNIQUE INDEX socialPosts_publicationId_unique_idx ON socialPosts (publicationId)`);
    } catch {
      // Index may already exist
    }

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

    return true;
  } catch (err) {
    console.error("[DB DDL Migration Error]", err);
    return false;
  }
}
