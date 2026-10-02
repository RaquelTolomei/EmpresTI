-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COLLABORATOR', 'OPERATIONS');

CREATE TYPE "EquipmentCategory" AS ENUM (
  'NOTEBOOK',
  'MONITOR',
  'CAMERA',
  'CABLE',
  'DOCK',
  'PROJECTOR',
  'ACCESSORY'
);

CREATE TYPE "EquipmentStatus" AS ENUM (
  'AVAILABLE',
  'LOANED',
  'MAINTENANCE',
  'OUT_OF_SERVICE'
);

CREATE TYPE "LoanStatus" AS ENUM ('OPEN', 'CLOSED');

CREATE TYPE "AuditAction" AS ENUM (
  'EQUIPMENT_CREATED',
  'EQUIPMENT_UPDATED',
  'EQUIPMENT_STATUS_CHANGED',
  'LOAN_CREATED',
  'LOAN_RETURNED',
  'LOAN_REJECTED'
);

-- CreateTable tenants
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable memberships
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COLLABORATOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable equipment
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "EquipmentCategory" NOT NULL,
    "patrimony_code" TEXT NOT NULL,
    "serial_number" TEXT,
    "location" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "available_at" TIMESTAMP(3),
    "last_returned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable loans
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'OPEN',
    "borrowed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMP(3) NOT NULL,
    "returned_at" TIMESTAMP(3),
    "returned_by_user_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable audit_events
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "details" JSONB,
    "equipment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex tenants_slug_key
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants" ("slug");

-- CreateIndex memberships_tenant_id_user_id_key
CREATE UNIQUE INDEX "memberships_tenant_id_user_id_key" ON "memberships" ("tenant_id", "user_id");

CREATE INDEX "memberships_tenant_id_role_idx"
ON "memberships" ("tenant_id", "role");

-- CreateIndex equipment_tenant_id_patrimony_code_key
CREATE UNIQUE INDEX "equipment_tenant_id_patimony_code_key" ON "equipment" ("tenant_id", "patrimony_code");

CREATE UNIQUE INDEX "equipment_tenant_id_serial_number_key"
ON "equipment" ("tenant_id", "serial_number")
WHERE "serial_number" IS NOT NULL;

CREATE INDEX "equipment_tenant_id_status_idx"
ON "equipment" ("tenant_id", "status");

CREATE INDEX "equipment_tenant_id_category_idx"
ON "equipment" ("tenant_id", "category");

CREATE INDEX "equipment_tenant_id_location_idx"
ON "equipment" ("tenant_id", "location");

-- CreateIndex loans_tenant_id_user_id_idx
CREATE INDEX "loans_tenant_id_user_id_idx"
ON "loans" ("tenant_id", "user_id");

CREATE INDEX "loans_tenant_id_due_at_idx"
ON "loans" ("tenant_id", "due_at");

CREATE INDEX "loans_tenant_id_status_idx"
ON "loans" ("tenant_id", "status");

CREATE INDEX "loans_tenant_id_equipment_id_idx"
ON "loans" ("tenant_id", "equipment_id");

-- Partial unique index: only one open loan per equipment at a time
CREATE UNIQUE INDEX "loan_one_open_per_equipment"
ON "loans" ("tenant_id", "equipment_id")
WHERE "status" = 'OPEN';

CREATE INDEX "audit_events_tenant_id_action_idx"
ON "audit_events" ("tenant_id", "action");

CREATE INDEX "audit_events_tenant_id_created_at_idx"
ON "audit_events" ("tenant_id", "created_at");

CREATE INDEX "audit_events_tenant_id_resource_type_resource_id_idx"
ON "audit_events" ("tenant_id", "resource_type", "resource_id");

-- Foreign keys
ALTER TABLE "memberships"
ADD CONSTRAINT "memberships_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "equipment"
ADD CONSTRAINT "equipment_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "loans"
ADD CONSTRAINT "loans_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "loans"
ADD CONSTRAINT "loans_equipment_id_fkey"
FOREIGN KEY ("equipment_id") REFERENCES "equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "audit_events"
ADD CONSTRAINT "audit_events_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "audit_events"
ADD CONSTRAINT "audit_events_equipment_id_fkey"
FOREIGN KEY ("equipment_id") REFERENCES "equipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
