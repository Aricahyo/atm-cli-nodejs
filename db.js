// Mengimpor paket mysql2
const mysql = require('mysql2/promise');

// Membuat koneksi ke database menggunakan informasi dari file .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Mengekspor koneksi agar bisa digunakan di file lain
module.exports = pool;