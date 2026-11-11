-- Align persisted equipment states with the v1 specification.
CREATE TYPE "EquipmentStatus_new" AS ENUM (
    'AVAILABLE',
    'MAINTENANCE',
    'RETIRED'
);

ALTER TABLE "equipment"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "equipment"
ALTER COLUMN "status" TYPE "EquipmentStatus_new"
USING (
    CASE "status"::text
        WHEN 'OUT_OF_SERVICE' THEN 'RETIRED'
        WHEN 'LOANED' THEN 'AVAILABLE'
        ELSE "status"::text
    END
)::"EquipmentStatus_new";

ALTER TABLE "equipment"
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

DROP TYPE "EquipmentStatus";

ALTER TYPE "EquipmentStatus_new" RENAME TO "EquipmentStatus";
