# Proyek Simulasi ATM (Command-Line Interface)

Ini adalah proyek tugas dari Digital Skill Fair 41.0 oleh Dibimbing.id, yaitu sebuah simulasi mesin ATM berbasis CLI yang dibangun menggunakan Node.js dengan database MySQL.

## Fitur Utama
- Registrasi akun baru secara interaktif.
- Login pengguna yang aman (PIN disamarkan).
- Menu transaksi interaktif setelah login.
- Cek Saldo.
- Setor Tunai (Deposit).
- Tarik Tunai (Withdraw) dengan validasi saldo.
- Transfer antar akun dengan sistem transaksi database untuk menjaga integritas data.

## Teknologi yang Digunakan
- **Backend:** Node.js
- **Database:** MySQL
- **Library:**
  - `commander.js` untuk manajemen perintah CLI.
  - `inquirer.js` untuk membuat prompt dan menu interaktif.
  - `mysql2` untuk koneksi ke database.
  - `dotenv` untuk mengelola environment variables.

## Cara Instalasi dan Penggunaan

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/Aricahyo/atm-cli-nodejs.git](https://github.com/Aricahyo/atm-cli-nodejs.git)
    ```
2.  **Masuk ke direktori proyek:**
    ```bash
    cd atm-cli-nodejs
    ```
3.  **Install semua dependensi:**
    ```bash
    npm install
    ```
4.  **Setup Database:**
    - Pastikan Anda sudah menginstal MySQL Server.
    - Jalankan skrip `database.sql` untuk membuat database dan tabel yang diperlukan.
5.  **Konfigurasi Environment:**
    - Buat file `.env` di root proyek.
    - Isi file tersebut sesuai dengan format berikut:
      ```
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=password_anda
      DB_DATABASE=atm_db
      ```
6.  **Jalankan Aplikasi:**
    - Untuk melihat semua perintah yang tersedia:
      ```bash
      node atm.js --help
      ```
    - Untuk mendaftar akun baru:
      ```bash
      node atm.js register
      ```
    - Untuk login:
      ```bash
      node atm.js login
      ```