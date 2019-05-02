CREATE DATABASE telemetry_db;

CREATE TABLE IF NOT EXISTS metrics (
    id serial NOT NULL PRIMARY KEY,
    device_info json NOT NULL,
    display_time_unit VARCHAR (20) NOT NULL,
    trace_events json NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS traces (
    id serial NOT NULL PRIMARY KEY,
    metric_id INT NOT NULL,
    trace_cat VARCHAR (50) NOT NULL,
    trace_name VARCHAR (255) NOT NULL,
    trace_dur INT NOT NULL,
    api_level VARCHAR (20) NOT NULL,
    build_number VARCHAR (20) NOT NULL,
    bundle_id VARCHAR (50) NOT NULL,
    brand VARCHAR (50) NOT NULL,
    country VARCHAR (50) NOT NULL,
    device_id VARCHAR (50) NOT NULL,
    device_locale VARCHAR (50) NOT NULL,
    device_type VARCHAR (255),
    device_unique_id VARCHAR (50) NOT NULL,
    height SMALLINT NOT NULL,
    width SMALLINT NOT NULL,
    is_emulator BOOLEAN NOT NULL,
    is_tablet BOOLEAN NOT NULL,
    manufacturer VARCHAR (255) NOT NULL,
    max_memory INT NOT NULL,
    model VARCHAR (50) NOT NULL,
    server_version VARCHAR (50),
    system_name VARCHAR (50) NOT NULL,
    system_version VARCHAR (50),
    timezone VARCHAR (255) NOT NULL,
    app_version VARCHAR (50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (metric_id) REFERENCES metrics (id)
);