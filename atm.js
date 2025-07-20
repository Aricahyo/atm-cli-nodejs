// Memuat variabel lingkungan dari file .env
require('dotenv').config();

const { default: inquirer } = require('inquirer');
const { program } = require('commander');
const pool = require('./db');

let loggedInAccount = null;

// ======================================================================
// FUNGSI-FUNGSI UTAMA
// ======================================================================

async function checkBalance() {
  console.log(`\nSaldo Anda saat ini adalah: Rp${loggedInAccount.balance}\n`);
}

async function deposit() {
  const { amount } = await inquirer.prompt([
    {
      type: 'number',
      name: 'amount',
      message: 'Masukkan jumlah yang ingin disetor:',
      validate: (value) => value > 0 || 'Jumlah harus lebih dari 0',
    },
  ]);
  await pool.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, loggedInAccount.id]);
  await pool.query("INSERT INTO transactions (account_id, type, amount) VALUES (?, 'deposit', ?)", [loggedInAccount.id, amount]);
  loggedInAccount.balance = parseFloat(loggedInAccount.balance) + amount;
  console.log(`\nSetor tunai berhasil! Saldo baru Anda: Rp${loggedInAccount.balance}\n`);
}

async function withdraw() {
  const { amount } = await inquirer.prompt([
    {
      type: 'number',
      name: 'amount',
      message: 'Masukkan jumlah yang ingin ditarik:',
      validate: (value) => {
        if (value <= 0) return 'Jumlah harus lebih dari 0';
        if (value > loggedInAccount.balance) return 'Saldo tidak mencukupi';
        return true;
      },
    },
  ]);
  await pool.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, loggedInAccount.id]);
  await pool.query("INSERT INTO transactions (account_id, type, amount) VALUES (?, 'withdraw', ?)", [loggedInAccount.id, amount]);
  loggedInAccount.balance = parseFloat(loggedInAccount.balance) - amount;
  console.log(`\nTarik tunai berhasil! Saldo baru Anda: Rp${loggedInAccount.balance}\n`);
}

async function transfer() {
  const { targetAccountId, amount } = await inquirer.prompt([
    { type: 'number', name: 'targetAccountId', message: 'Masukkan nomor akun tujuan:', validate: (value) => value > 0 || 'Nomor akun tidak valid' },
    { type: 'number', name: 'amount', message: 'Masukkan jumlah yang ingin ditransfer:', validate: (value) => { if (value <= 0) return 'Jumlah harus lebih dari 0'; if (value > loggedInAccount.balance) return 'Saldo tidak mencukupi'; return true; } }
  ]);
  if (targetAccountId === loggedInAccount.id) {
    console.log('\nError: Anda tidak bisa mentransfer ke akun Anda sendiri.\n');
    return;
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [targetRows] = await connection.query('SELECT * FROM accounts WHERE id = ? FOR UPDATE', [targetAccountId]);
    if (targetRows.length === 0) {
      throw new Error('Akun tujuan tidak ditemukan.');
    }
    await connection.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, loggedInAccount.id]);
    await connection.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, targetAccountId]);
    await connection.query("INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, 'transfer_out', ?, ?)", [loggedInAccount.id, amount, targetAccountId]);
    await connection.query("INSERT INTO transactions (account_id, type, amount, target_id) VALUES (?, 'transfer_in', ?, ?)", [targetAccountId, amount, loggedInAccount.id]);
    await connection.commit();
    loggedInAccount.balance = parseFloat(loggedInAccount.balance) - amount;
    console.log(`\nTransfer berhasil! Saldo baru Anda: Rp${loggedInAccount.balance}\n`);
  } catch (error) {
    await connection.rollback();
    console.error(`\nTransfer gagal: ${error.message}\n`);
  } finally {
    connection.release();
  }
}

// ======================================================================
// MENU UTAMA SETELAH LOGIN
// ======================================================================

async function showMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Pilih transaksi yang Anda inginkan:',
      choices: [
        'Cek Saldo',
        'Setor Tunai',
        'Tarik Tunai',
        'Transfer',
        'Logout',
      ],
    },
  ]);
  switch (action) {
    case 'Cek Saldo': await checkBalance(); break;
    case 'Setor Tunai': await deposit(); break;
    case 'Tarik Tunai': await withdraw(); break;
    case 'Transfer': await transfer(); break;
    case 'Logout':
      console.log(`\nTerima kasih, ${loggedInAccount.name}. Sesi Anda telah berakhir.`);
      await pool.end();
      return;
  }
  await showMenu();
}

// ======================================================================
// KONFIGURASI DAN PERINTAH COMMANDER.JS
// ======================================================================

program
  .name('atm-cli')
  .description('Sebuah aplikasi simulasi mesin ATM berbasis Command-Line Interface (CLI) menggunakan Node.js dan MySQL.')
  .version('1.0.0');

program
  .command('register')
  .description('Membuat akun baru secara interaktif')
  .action(async () => {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Masukkan nama lengkap Anda:' },
      { type: 'password', name: 'pin', mask: '*', message: 'Buat 6 digit PIN Anda:', validate: (value) => /^\d{6}$/.test(value) || 'PIN harus terdiri dari 6 angka.' }
    ]);
    try {
      const [result] = await pool.query(
        'INSERT INTO accounts (name, pin, balance) VALUES (?, ?, ?)',
        [answers.name, answers.pin, 0]
      );
      console.log(`\nAkun berhasil dibuat!`);
      console.log(`Nomor Akun Anda adalah: ${result.insertId}`);
      console.log(`Harap simpan nomor akun Anda untuk login.\n`);
    } catch (error) { console.error('\nGagal membuat akun:', error); }
    await pool.end();
  });

program
  .command('login')
  .description('Login ke akun secara interaktif')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'accountNumber', message: 'Masukkan nomor akun Anda:' },
        { type: 'password', name: 'pin', mask: '*', message: 'Masukkan PIN Anda:' }
      ]);
      const [rows] = await pool.query('SELECT * FROM accounts WHERE id = ? AND pin = ?', [answers.accountNumber, answers.pin]);
      if (rows.length > 0) {
        loggedInAccount = rows[0];
        console.log(`\nLogin berhasil! Halo, ${loggedInAccount.name}.`);
        await showMenu();
      } else {
        console.error('Login gagal. Nomor akun atau PIN salah.');
        await pool.end();
      }
    } catch (error) { console.error('Terjadi kesalahan:', error); await pool.end(); }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}