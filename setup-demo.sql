-- Demo data setup for AI-HACCP Platform

-- Create demo organization
INSERT INTO organizations (name, type) VALUES 
('Demo Restaurant', 'restaurant');

-- Create demo user (password: 'password')
INSERT INTO users (email, password_hash, name, role, organization_id) VALUES 
('admin@lebouzou.com', '$2b$12$Hup1jDOCRFsslwMHfAGLje0Wx2TwHbETYKZT9GaLW4fmxpXtBpfA6', 'Demo Admin', 'admin', 1);

-- Create demo products
INSERT INTO products (organization_id, name, category, allergens, shelf_life_days, storage_temp_min, storage_temp_max) VALUES 
(1, 'Fresh Chicken Breast', 'Meat', '{}', 3, 0, 4),
(1, 'Milk', 'Dairy', '{milk}', 7, 0, 4),
(1, 'Bread Rolls', 'Bakery', '{gluten, eggs}', 2, 18, 25),
(1, 'Frozen Vegetables', 'Vegetables', '{}', 365, -18, -15),
(1, 'Cheese', 'Dairy', '{milk}', 14, 0, 4);

-- Create demo suppliers
INSERT INTO suppliers (organization_id, name, contact_info, certification_status, risk_level) VALUES 
(1, 'Fresh Foods Inc', '{"phone": "+1-555-0123", "email": "orders@freshfoods.com"}', 'certified', 1),
(1, 'Dairy Delights', '{"phone": "+1-555-0456", "email": "sales@dairydelights.com"}', 'certified', 1),
(1, 'Frozen Express', '{"phone": "+1-555-0789", "email": "info@frozenexpress.com"}', 'pending', 2);

-- Create demo temperature logs
INSERT INTO temperature_logs (organization_id, location, temperature, recorded_by, equipment_id, is_within_limits) VALUES 
(1, 'Walk-in Cooler', 2.5, 1, 'COOLER_01', true),
(1, 'Freezer Unit', -18.0, 1, 'FREEZER_01', true),
(1, 'Prep Area Fridge', 3.8, 1, 'PREP_FRIDGE_01', true),
(1, 'Walk-in Cooler', 6.2, 1, 'COOLER_01', false),
(1, 'Freezer Unit', -17.5, 1, 'FREEZER_01', true);

-- Create demo cleaning records
INSERT INTO cleaning_records (organization_id, area, cleaning_type, products_used, performed_by, verified_by, notes) VALUES 
(1, 'Kitchen Floor', 'Deep Clean', '{degreaser, sanitizer}', 1, 1, 'Completed full deep clean and sanitization'),
(1, 'Prep Surfaces', 'Daily Clean', '{sanitizer}', 1, 1, 'All prep surfaces cleaned and sanitized'),
(1, 'Equipment', 'Weekly Clean', '{degreaser, sanitizer}', 1, 1, 'All equipment cleaned and inspected');

-- Create demo batch tracking
INSERT INTO batch_tracking (organization_id, batch_number, product_id, supplier_id, production_date, expiry_date, location, status) VALUES 
(1, 'CHK001', 1, 1, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 'Walk-in Cooler', 'received'),
(1, 'MLK002', 2, 2, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'Walk-in Cooler', 'in_process'),
(1, 'FRZ003', 4, 3, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', 'Freezer Unit', 'received');

-- Create demo incidents
INSERT INTO incidents (organization_id, title, description, severity, category, reported_by, status, root_cause, corrective_actions) VALUES 
(1, 'Temperature Excursion - Walk-in Cooler', 'Walk-in cooler temperature exceeded 4°C for 2 hours', 'medium', 'temperature', 1, 'resolved', 'Faulty door seal', 'Replaced door seal, adjusted temperature settings'),
(1, 'Foreign Object Found', 'Small piece of plastic found in prep area', 'high', 'physical', 1, 'open', 'Under investigation', 'Area cordoned off, investigation ongoing');

-- Create demo cleaning plan
INSERT INTO cleaning_plans (organization_id, name, description, rooms, cleaning_frequency, estimated_duration) VALUES 
(1, 'Daily Kitchen Cleaning', 'Complete daily cleaning plan for kitchen areas', 
'[{"name":"Kitchen","x":50,"y":50,"width":200,"height":150},{"name":"Prep Area","x":300,"y":50,"width":150,"height":100},{"name":"Storage","x":50,"y":250,"width":100,"height":100},{"name":"Dishwashing","x":200,"y":250,"width":150,"height":100}]', 
'daily', 120);

-- Create demo room cleanings
INSERT INTO room_cleanings (organization_id, cleaning_plan_id, room_name, cleaned_by, notes) VALUES 
(1, 1, 'Kitchen', 1, 'Deep cleaned and sanitized'),
(1, 1, 'Prep Area', 1, 'Surfaces cleaned and disinfected');

-- Create demo material receptions
INSERT INTO material_receptions (organization_id, supplier_id, product_name, category, barcode, quantity, unit, expiry_date, batch_number, temperature_on_arrival, received_by, ai_analysis) VALUES 
(1, 1, 'Fresh Chicken Breast', 'poultry', '1234567890123', 2.5, 'kg', CURRENT_DATE + INTERVAL '3 days', 'CB240201', 2.0, 1, '{"success": true, "confidence": 0.92}'),
(1, 2, 'Organic Milk', 'dairy', '9876543210987', 4.0, 'l', CURRENT_DATE + INTERVAL '7 days', 'OM240205', 3.5, 1, '{"success": true, "confidence": 0.88}'),
(1, 3, 'Mixed Vegetables', 'vegetables', '5555666677778', 5.0, 'kg', CURRENT_DATE + INTERVAL '5 days', 'MV240208', 4.0, 1, '{"success": true, "confidence": 0.85}');

-- Create demo usage logs for cost tracking
INSERT INTO usage_logs (user_id, organization_id, action_type, resource_used, metadata) VALUES 
(1, 1, 'login', 0.001, '{"timestamp": "2024-01-15T10:00:00Z"}'),
(1, 1, 'temperature_log', 0.002, '{"location": "Walk-in Cooler"}'),
(1, 1, 'product_create', 0.005, '{"product_name": "Fresh Chicken Breast"}'),
(1, 1, 'data_query', 0.001, '{"query_type": "temperature_logs"}'),
(1, 1, 'api_call', 0.001, '{"endpoint": "/products"}'),
(1, 1, 'storage', 0.0001, '{"file_size": "1MB"}'),
(1, 1, 'computation', 0.003, '{"operation": "report_generation"}');