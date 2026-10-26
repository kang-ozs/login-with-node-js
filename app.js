const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const parser = require('body-parser');
const crypto =require('crypto');
//const ejs = require('ejs');
const path = require('path');
const { convertProcessSignalToExitCode } = require('util');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


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

// 3 jalankan midelware
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());


// 4. mengatur folder public sebagai file statis
app.use(express.static(path.join(__dirname,'public')));

// Atur view engine ke ejs
app.set('view engine', 'ejs');

// Mengatur Express bahwa folder template bernama 'views'
app.set('views', path.join(__dirname, 'views'));

// 5. mengatur session
app.use(session({
    secret :'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie : {
        maxAge:60000 *30 
    } // session aktif selama 30 menit
}));


// 6. route utama ke halaman login
app.get('/',(req,res)=>{
    if(req.session.loggedin){
        res.redirect('/dashboard');
    } else {
        res.render('index',{error : null}) ;
    }
});


// 7. proses login
app.post('/login',(req,res)=>{
    const {username, password} = req.body;

    if(username && password){
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        db.query('SELECT * FROM users WHERE username=? and password=?',[username,hashedPassword],(error,results)=>{
            if(error) throw error;
                if(results.length > 0){
                    req.session.loggedin=true;
                    req.session.username = results[0].username;
                    req.session.role = results[0].role;
                    res.redirect('/dashboard');
                } else {
                    res.render('index',{error:'Username dan atau password salah'});
                }
            });
    } else {
         res.render('index',{error:'masukan username dan password'});
    }

});

// 7. proses login
app.get('/dashboard',(req,res)=>{
    if(req.session.loggedin){
        res.render('dashboard',{
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.render('index',{error : 'Anda belum login, silahkan login'});
    }
});


//  route logout
app.get('/logout',(req,res)=> {
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
});

/* ------------------------------- CRUD Anggota -------------------------- */

app.get('/anggota',(req,res)=>{
    if(req.session.loggedin){
        res.render('anggota/tampil',{
            username:req.session.username,
            role: req.session.role
        });
    } else {

    }
});






// jalankan apkikasi
app.listen(PORT,() => {
    console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});


// token : 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