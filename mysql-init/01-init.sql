-- Initialize database for AgriZen application
USE agrigrow;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('FARMER', 'BUYER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create crop_listings table
CREATE TABLE IF NOT EXISTS crop_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_farmers_email ON farmers(email);
CREATE INDEX idx_crop_listings_farmer_id ON crop_listings(farmer_id);
CREATE INDEX idx_crop_listings_crop_type ON crop_listings(crop_type);
CREATE INDEX idx_crop_listings_category ON crop_listings(category);

-- Insert sample data (optional)
INSERT IGNORE INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@agrizen.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'BUYER'),
('Test Farmer', 'farmer@agrizen.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'FARMER');

INSERT IGNORE INTO farmers (name, email, phone, location) VALUES 
('Test Farmer', 'farmer@agrizen.com', '+1234567890', 'Test Location');
