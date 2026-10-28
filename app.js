const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;



// 1 jalankan midelware
app.use(parser.urlencoded({ extended:true }));
app.use(parser.json());


// 2. mengatur folder public sebagai file statis
app.use(express.static(path.join(__dirname,'public')));

// 3. Atur view engine ke ejs
app.set('view engine', 'ejs');

// Mengatur Express bahwa folder template bernama 'views'
app.set('views', path.join(__dirname, 'views'));

// 4. mengatur session
app.use(session({
    secret :'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie : {
        maxAge:60000 *30 
    } // session aktif selama 30 menit
}));

// 5. PEMANGGILAN ROUTE APLIKASI ---
const authRouter = require('./routes/auth');
const anggotaRouter = require('./routes/anggota');

app.use('/', authRouter);            // Menangani /, /login, /logout, dan /dashboard
app.use('/anggota', anggotaRouter);  // Menangani /anggota



// 6. jalankan apkikasi
app.listen(PORT,() => {
    console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});