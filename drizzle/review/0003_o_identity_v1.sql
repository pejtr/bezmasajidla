-- O-Identity v1 — review migration.
-- Intentionally NOT wired into Drizzle meta journal yet.
-- Generate/reconcile through drizzle-kit before any production migration.

CREATE TABLE `o_identities` (
  `id` varchar(36) NOT NULL,
  `entity_type` enum('person','organization','venue','brand','creator','agent') NOT NULL DEFAULT 'person',
  `status` enum('active','disabled','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `o_identities_id_pk` PRIMARY KEY(`id`)
);

CREATE INDEX `o_identities_entity_status_idx`
  ON `o_identities` (`entity_type`, `status`);

CREATE TABLE `o_identity_links` (
  `id` int AUTO_INCREMENT NOT NULL,
  `o_identity_id` varchar(36) NOT NULL,
  `provider` varchar(64) NOT NULL,
  `provider_subject` varchar(191) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `o_identity_links_id_pk` PRIMARY KEY(`id`),
  CONSTRAINT `o_identity_links_provider_subject_uidx`
    UNIQUE(`provider`, `provider_subject`)
);

CREATE INDEX `o_identity_links_o_identity_idx`
  ON `o_identity_links` (`o_identity_id`);

CREATE TABLE `o_domain_identities` (
  `subject_id` varchar(64) NOT NULL,
  `o_identity_id` varchar(36) NOT NULL,
  `domain` enum('veg','travel','creator','shopper','wellmind') NOT NULL,
  `visibility` enum('private','public') NOT NULL DEFAULT 'private',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `o_domain_identities_subject_id_pk` PRIMARY KEY(`subject_id`),
  CONSTRAINT `o_domain_identities_root_domain_uidx`
    UNIQUE(`o_identity_id`, `domain`)
);

CREATE INDEX `o_domain_identities_domain_idx`
  ON `o_domain_identities` (`domain`);

CREATE TABLE `veg_profiles` (
  `subject_id` varchar(64) NOT NULL,
  `display_name` varchar(120),
  `public_handle` varchar(40),
  `diet_style` enum('vegan','vegetarian','flexitarian','plant-curious','other'),
  `favorite_cuisines` text,
  `profile_visibility` enum('private','public') NOT NULL DEFAULT 'private',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `veg_profiles_subject_id_pk` PRIMARY KEY(`subject_id`),
  CONSTRAINT `veg_profiles_public_handle_unique` UNIQUE(`public_handle`)
);

CREATE INDEX `veg_profiles_visibility_idx`
  ON `veg_profiles` (`profile_visibility`);

CREATE TABLE `o_user_interactions` (
  `id` varchar(36) NOT NULL,
  `subject_id` varchar(64) NOT NULL,
  `target_type` enum('recipe','venue','article','product') NOT NULL,
  `target_id` varchar(256) NOT NULL,
  `action` enum('favorite','want_to_visit','visited','want_to_cook','cooked','saved') NOT NULL,
  `metadata` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `o_user_interactions_id_pk` PRIMARY KEY(`id`),
  CONSTRAINT `o_user_interactions_subject_target_action_uidx`
    UNIQUE(`subject_id`, `target_type`, `target_id`, `action`)
);

CREATE INDEX `o_user_interactions_subject_action_idx`
  ON `o_user_interactions` (`subject_id`, `action`);

CREATE TABLE `o_consent_grants` (
  `id` varchar(36) NOT NULL,
  `subject_id` varchar(64) NOT NULL,
  `scope` varchar(128) NOT NULL,
  `status` enum('granted','revoked') NOT NULL,
  `source` varchar(64) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` timestamp NULL,
  CONSTRAINT `o_consent_grants_id_pk` PRIMARY KEY(`id`)
);

CREATE INDEX `o_consent_grants_subject_scope_idx`
  ON `o_consent_grants` (`subject_id`, `scope`);

CREATE TABLE `o_identity_audit_events` (
  `id` varchar(36) NOT NULL,
  `o_identity_id` varchar(36) NOT NULL,
  `actor_subject_id` varchar(64),
  `event_type` varchar(96) NOT NULL,
  `metadata` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `o_identity_audit_events_id_pk` PRIMARY KEY(`id`)
);

CREATE INDEX `o_identity_audit_root_created_idx`
  ON `o_identity_audit_events` (`o_identity_id`, `created_at`);
