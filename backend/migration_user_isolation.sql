-- Migration script to ensure proper user isolation
-- This script adds missing user tracking fields and ensures data integrity

-- Add created_by field to products table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'created_by') THEN
        ALTER TABLE products ADD COLUMN created_by INTEGER REFERENCES users(id);
        -- Set existing products to be owned by the first admin user of each organization
        UPDATE products SET created_by = (
            SELECT u.id FROM users u 
            WHERE u.organization_id = products.organization_id 
            AND u.role = 'admin' 
            LIMIT 1
        );
    END IF;
END $$;

-- Add created_by field to suppliers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'suppliers' AND column_name = 'created_by') THEN
        ALTER TABLE suppliers ADD COLUMN created_by INTEGER REFERENCES users(id);
        -- Set existing suppliers to be owned by the first admin user of each organization
        UPDATE suppliers SET created_by = (
            SELECT u.id FROM users u 
            WHERE u.organization_id = suppliers.organization_id 
            AND u.role = 'admin' 
            LIMIT 1
        );
    END IF;
END $$;

-- Add created_by field to cleaning_plans table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cleaning_plans' AND column_name = 'created_by') THEN
        ALTER TABLE cleaning_plans ADD COLUMN created_by INTEGER REFERENCES users(id);
        -- Set existing cleaning plans to be owned by the first admin user of each organization
        UPDATE cleaning_plans SET created_by = (
            SELECT u.id FROM users u 
            WHERE u.organization_id = cleaning_plans.organization_id 
            AND u.role = 'admin' 
            LIMIT 1
        );
    END IF;
END $$;

-- Ensure all temperature_logs have recorded_by field populated
UPDATE temperature_logs 
SET recorded_by = (
    SELECT u.id FROM users u 
    WHERE u.organization_id = temperature_logs.organization_id 
    LIMIT 1
) 
WHERE recorded_by IS NULL;

-- Ensure all incidents have reported_by field populated
UPDATE incidents 
SET reported_by = (
    SELECT u.id FROM users u 
    WHERE u.organization_id = incidents.organization_id 
    LIMIT 1
) 
WHERE reported_by IS NULL;

-- Ensure all material_receptions have received_by field populated
UPDATE material_receptions 
SET received_by = (
    SELECT u.id FROM users u 
    WHERE u.organization_id = material_receptions.organization_id 
    LIMIT 1
) 
WHERE received_by IS NULL;

-- Ensure all room_cleanings have cleaned_by field populated
UPDATE room_cleanings 
SET cleaned_by = (
    SELECT u.id FROM users u 
    WHERE u.organization_id = room_cleanings.organization_id 
    LIMIT 1
) 
WHERE cleaned_by IS NULL;

-- Ensure all cleaning_records have performed_by field populated
UPDATE cleaning_records 
SET performed_by = (
    SELECT u.id FROM users u 
    WHERE u.organization_id = cleaning_records.organization_id 
    LIMIT 1
) 
WHERE performed_by IS NULL;

-- Add indexes for better performance on user-filtered queries
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_by ON suppliers(created_by);
CREATE INDEX IF NOT EXISTS idx_cleaning_plans_created_by ON cleaning_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_temperature_logs_recorded_by ON temperature_logs(recorded_by);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_by ON incidents(reported_by);
CREATE INDEX IF NOT EXISTS idx_material_receptions_received_by ON material_receptions(received_by);
CREATE INDEX IF NOT EXISTS idx_room_cleanings_cleaned_by ON room_cleanings(cleaned_by);
CREATE INDEX IF NOT EXISTS idx_cleaning_records_performed_by ON cleaning_records(performed_by);

-- Add composite indexes for organization + user queries
CREATE INDEX IF NOT EXISTS idx_products_org_user ON products(organization_id, created_by);
CREATE INDEX IF NOT EXISTS idx_suppliers_org_user ON suppliers(organization_id, created_by);
CREATE INDEX IF NOT EXISTS idx_temperature_logs_org_user ON temperature_logs(organization_id, recorded_by);
CREATE INDEX IF NOT EXISTS idx_incidents_org_user ON incidents(organization_id, reported_by);

COMMIT;