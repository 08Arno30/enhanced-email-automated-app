CREATE DATABASE automated_app;

-- REMEMBER TO CONNECT TO DB BEFORE CREATING TABLES

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_firstname VARCHAR(255) NOT NULL,
    user_lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  recipient_id INTEGER NOT NULL REFERENCES users(id),
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  original_language VARCHAR(255) NOT NULL,
  translated_body TEXT NOT NULL,
  sent_at TIMESTAMP,
  received_at TIMESTAMP,
  is_sent BOOLEAN,
  is_urgent BOOLEAN
);

CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  email_id INTEGER NOT NULL REFERENCES emails(id),
  name VARCHAR(255) NOT NULL,
  content_type VARCHAR(255) NOT NULL,
  content BYTEA NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    user_picture BYTEA,
    picture_filename VARCHAR(255),
    picture_content_type VARCHAR(255),
    preferred_language VARCHAR(255) NOT NULL
);