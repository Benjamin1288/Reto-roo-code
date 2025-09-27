CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    UNIQUE (date, time)
);