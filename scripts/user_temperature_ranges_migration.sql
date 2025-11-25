-- Migration to add user-specific temperature ranges

-- Create user_temperature_ranges table
CREATE TABLE user_temperature_ranges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    refrigerated_min DECIMAL(5,2) DEFAULT 0.0,
    refrigerated_max DECIMAL(5,2) DEFAULT 4.0,
    frozen_min DECIMAL(5,2) DEFAULT -25.0,
    frozen_max DECIMAL(5,2) DEFAULT -18.0,
    ambient_min DECIMAL(5,2) DEFAULT 15.0,
    ambient_max DECIMAL(5,2) DEFAULT 25.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create index for performance
CREATE INDEX idx_user_temp_ranges_user ON user_temperature_ranges(user_id);
CREATE INDEX idx_user_temp_ranges_org ON user_temperature_ranges(organization_id);

-- Insert default ranges for existing users
INSERT INTO user_temperature_ranges (user_id, organization_id)
SELECT id, organization_id FROM users WHERE is_active = true;