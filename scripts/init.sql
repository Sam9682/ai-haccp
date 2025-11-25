-- AI-HACCP Database Schema

-- Users and Organizations
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- restaurant, chain, supplier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, manager, staff
    organization_id INTEGER REFERENCES organizations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cost Management
CREATE TABLE usage_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    organization_id INTEGER REFERENCES organizations(id),
    action_type VARCHAR(100) NOT NULL, -- api_call, storage, computation
    resource_used DECIMAL(10,6) NOT NULL, -- cost in USD
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HACCP Core Tables
CREATE TABLE hazard_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    severity_level INTEGER DEFAULT 1
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    allergens TEXT[],
    shelf_life_days INTEGER,
    storage_temp_min DECIMAL(5,2),
    storage_temp_max DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    contact_info JSONB,
    certification_status VARCHAR(50),
    risk_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE critical_control_points (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    process_step VARCHAR(255),
    hazard_type VARCHAR(100),
    critical_limit_min DECIMAL(10,2),
    critical_limit_max DECIMAL(10,2),
    monitoring_frequency VARCHAR(100),
    corrective_actions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monitoring and Records
CREATE TABLE temperature_logs (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    location VARCHAR(255) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    recorded_by INTEGER REFERENCES users(id),
    equipment_id VARCHAR(100),
    is_within_limits BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cleaning_records (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    area VARCHAR(255) NOT NULL,
    cleaning_type VARCHAR(100),
    products_used TEXT[],
    performed_by INTEGER REFERENCES users(id),
    verified_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_deliveries (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    product_id INTEGER REFERENCES products(id),
    batch_number VARCHAR(255),
    quantity DECIMAL(10,2),
    temperature_on_arrival DECIMAL(5,2),
    quality_check_passed BOOLEAN,
    received_by INTEGER REFERENCES users(id),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Traceability
CREATE TABLE batch_tracking (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    batch_number VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    production_date DATE,
    expiry_date DATE,
    location VARCHAR(255),
    status VARCHAR(50), -- received, in_process, finished, shipped
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents and Corrective Actions
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50),
    category VARCHAR(100),
    reported_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'open',
    root_cause TEXT,
    corrective_actions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Audits and Compliance
CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    audit_type VARCHAR(100),
    auditor_name VARCHAR(255),
    audit_date DATE,
    score INTEGER,
    findings TEXT,
    recommendations TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default hazard categories
INSERT INTO hazard_categories (name, description, severity_level) VALUES
('Biological', 'Bacteria, viruses, parasites, fungi', 3),
('Chemical', 'Cleaning agents, pesticides, allergens', 2),
('Physical', 'Foreign objects, glass, metal fragments', 2),
('Allergens', 'Common food allergens', 2);

-- Configuration Management
CREATE TABLE configuration (
    id SERIAL PRIMARY KEY,
    parameter VARCHAR(255) NOT NULL UNIQUE,
    value VARCHAR(1000) NOT NULL,
    parent_parameter VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cleaning Plans
CREATE TABLE cleaning_plans (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rooms JSONB,
    cleaning_frequency VARCHAR(50) NOT NULL,
    estimated_duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_cleanings (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    cleaning_plan_id INTEGER REFERENCES cleaning_plans(id),
    room_name VARCHAR(255) NOT NULL,
    cleaned_by INTEGER REFERENCES users(id),
    notes TEXT,
    cleaned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material Reception
CREATE TABLE material_receptions (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    barcode VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE,
    batch_number VARCHAR(255),
    temperature_on_arrival DECIMAL(5,2),
    quality_notes TEXT,
    image_path VARCHAR(500),
    ai_analysis JSONB,
    received_by INTEGER REFERENCES users(id),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration parameters
INSERT INTO configuration (parameter, value) VALUES
('temperature_alert_threshold', '5.0'),
('max_temperature_fridge', '4.0'),
('min_temperature_fridge', '0.0'),
('max_temperature_freezer', '-15.0'),
('min_temperature_freezer', '-18.0'),
('cleaning_overdue_hours', '24'),
('incident_auto_escalation_hours', '48'),
('supplier_risk_threshold', '3'),
('batch_expiry_warning_days', '7'),
('ai_analysis_confidence_threshold', '0.8'),
('max_file_upload_size_mb', '10'),
('session_timeout_minutes', '30'),
('backup_retention_days', '90'),
('audit_log_retention_days', '365'),
('cost_alert_threshold_usd', '100.0');

-- Create indexes for performance
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_usage_logs_org_date ON usage_logs(organization_id, created_at);
CREATE INDEX idx_temperature_logs_org_date ON temperature_logs(organization_id, created_at);
CREATE INDEX idx_batch_tracking_batch ON batch_tracking(batch_number);
CREATE INDEX idx_incidents_org_status ON incidents(organization_id, status);
CREATE INDEX idx_configuration_parameter ON configuration(parameter);
CREATE INDEX idx_material_receptions_org_date ON material_receptions(organization_id, received_at);