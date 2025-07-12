CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  mq7 DECIMAL(5,2),
  mq135 DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_created_at ON sensor_readings(created_at DESC);

INSERT INTO sensor_readings (temperature, humidity, co_level, air_quality) VALUES
(28.5, 65.2, 12.5, 85),
(29.1, 63.8, 11.2, 78),
(27.9, 67.1, 13.8, 92),
(28.8, 64.5, 10.9, 72),
(30.2, 61.3, 15.2, 98);
