-- MySQL Schema for TESSERON FleetSync

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `upload_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `records` INT DEFAULT 0,
    `size_mb` DECIMAL(10,3) DEFAULT 0.000,
    `source` VARCHAR(50) DEFAULT 'Manual',
    `uploader_name` VARCHAR(255) DEFAULT '',
    `uploader_email` VARCHAR(255) DEFAULT '',
    `error_message` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `fleetsync` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `upload_id` INT NOT NULL,
    `station_name` VARCHAR(255),
    `service_station_location` VARCHAR(255),
    `station_number` VARCHAR(100),
    `transaction_number` VARCHAR(100),
    `service_country` VARCHAR(100),
    `cost_group` VARCHAR(100),
    `product_group` VARCHAR(100),
    `product_type` VARCHAR(100),
    `product_code` VARCHAR(100),
    `payment_currency` VARCHAR(10),
    `unit` VARCHAR(20),
    `quantity` DECIMAL(14,4),
    `price_per_unit` DECIMAL(14,4),
    `net_base_value` DECIMAL(14,2),
    `net_service_value` DECIMAL(14,2),
    `net_purchase_value` DECIMAL(14,2),
    `currency_of_service` VARCHAR(10),
    `value_in_payment_currency` DECIMAL(14,2),
    `value_in_service_country_currency` DECIMAL(14,2),
    `vat` DECIMAL(14,2),
    `price_per_unit_gross` DECIMAL(14,4),
    `net_discount` DECIMAL(14,2),
    `vehicle_number` VARCHAR(100),
    `billing_date` DATE,
    `bill_number` VARCHAR(100),
    `invoice_number` VARCHAR(100),
    `ticket_number_dkv` VARCHAR(100),
    `postcode_of_station` VARCHAR(50),
    `gross_base_value` DECIMAL(14,2),
    `kostenstelle_1` VARCHAR(100),
    `kostenstelle_2` VARCHAR(100),
    `abrechnungsobjekt_nummer` VARCHAR(100),
    `country_of_invoice` VARCHAR(100),
    `odometer` BIGINT,
    `gross_discount` DECIMAL(14,2),
    `alter_terminal` VARCHAR(100),
    `client_number` VARCHAR(100),
    `transaction_date` DATE,
    `transaction_time` VARCHAR(20),
    `distance_since_last_fill` DECIMAL(10,2),
    `year_month` VARCHAR(20),
    `energy_type` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_upload_id` (`upload_id`),
    KEY `idx_transaction_date` (`transaction_date`),
    KEY `idx_vehicle_number` (`vehicle_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vehicles` (
    `vehicle_id` VARCHAR(20) PRIMARY KEY,
    `plate` VARCHAR(50),
    `make` VARCHAR(100),
    `model` VARCHAR(100),
    `year` INT,
    `type` VARCHAR(50),
    `status` VARCHAR(50),
    `odometer_km` BIGINT,
    `acquisition_date` DATE,
    `last_service_date` DATE,
    `last_service_odometer_km` BIGINT,
    `assigned_driver_id` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_vehicles_status` (`status`),
    KEY `idx_vehicles_driver` (`assigned_driver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `drivers` (
    `driver_id` VARCHAR(20) PRIMARY KEY,
    `name` VARCHAR(255),
    `license_class` VARCHAR(10),
    `hire_date` DATE,
    `status` VARCHAR(50),
    `assigned_vehicle_id` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_drivers_status` (`status`),
    KEY `idx_drivers_vehicle` (`assigned_vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `maintenance` (
    `record_id` VARCHAR(20) PRIMARY KEY,
    `vehicle_id` VARCHAR(20),
    `service_date` DATE,
    `odometer_km` BIGINT,
    `service_type` VARCHAR(100),
    `cost` DECIMAL(14,2),
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_maintenance_vehicle` (`vehicle_id`),
    KEY `idx_maintenance_date` (`service_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `trips` (
    `trip_id` VARCHAR(20) PRIMARY KEY,
    `vehicle_id` VARCHAR(20),
    `driver_id` VARCHAR(20),
    `trip_date` DATE,
    `origin` VARCHAR(255),
    `destination` VARCHAR(255),
    `distance_km` DECIMAL(10,2),
    `duration_hr` DECIMAL(10,2),
    `fuel_liters` DECIMAL(10,2),
    `fuel_cost` DECIMAL(14,2),
    `purpose` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_trips_vehicle` (`vehicle_id`),
    KEY `idx_trips_driver` (`driver_id`),
    KEY `idx_trips_date` (`trip_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
