CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE localization (
    key_name VARCHAR(100) PRIMARY KEY,
    en_text TEXT NOT NULL,
    sv_text TEXT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    description TEXT,
    in_price DECIMAL(10, 2),
    out_price DECIMAL(10, 2),
    vat DECIMAL(5, 2),
    unit VARCHAR(20),
    stock INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO localization (key_name, en_text, sv_text) VALUES 
('login_title', 'Log in', 'Logga in'),
('username_label', 'Epost adress', 'Epost adress'),
('username_label_long', 'Enter your email address', 'Skriv in din epost adress'),
('password_label', 'Lösenord', 'Lösenord'),
('password_label_long', 'Enter your password', 'Skriv in ditt lösenord'),
('login_button', 'Logga in', 'Logga in'),
('forgot_password', 'Forgot password?', 'Glömt lösenord?'),
('register_link', 'Register', 'Registrera dig'),
('language_select', 'Language', 'Språk');
