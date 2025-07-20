-- Membuat database jika belum ada
CREATE DATABASE IF NOT EXISTS atm_db;

-- Memberitahu MySQL untuk menggunakan database ini
USE atm_db;

-- Membuat tabel untuk menyimpan data akun nasabah
-- 
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- 
    pin VARCHAR(255) NOT NULL, -- 
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 
);

-- Membuat tabel untuk menyimpan riwayat transaksi
-- 
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT, -- 
    type ENUM('deposit', 'withdraw', 'transfer_in', 'transfer_out') NOT NULL, -- 
    amount DECIMAL(15, 2) NOT NULL, -- 
    target_id INT NULL, -- 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);