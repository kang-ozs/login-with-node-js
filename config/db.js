const mysql = require('mysql2');

// 1. konfigurasi mysql
const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'db_login_system'
});

// 2, buat koneksi
db.connect((err)=>{
  if(err) {
        console.log('Gagal terhubung ke mysql ',err);
        throw err;
    }
        console.log('berhasil terhubung ke mysql ');
});

module.exports = db;