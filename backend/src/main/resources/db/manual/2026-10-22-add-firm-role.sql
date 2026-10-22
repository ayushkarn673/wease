-- Adds the FIRM account type (labour firms). Hibernate's ddl-auto=update creates new tables and
-- columns but does not widen an existing ENUM column, so this has to be run once on each database.
-- Safe to run: existing rows keep their values; nothing is removed.
ALTER TABLE users MODIFY role ENUM('ADMIN', 'CUSTOMER', 'WORKER', 'FIRM') NULL;