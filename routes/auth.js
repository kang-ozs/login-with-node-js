// routes/auth.js
const express = require('express');
const router  = express.Router(); 
const crypto  = require('crypto');
const db   = require('../config/db'); 

// Halaman utama / login (Ini yang akan menangani "GET /")
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('index', { error: null });
    }
});


// 7. proses login
router.post('/login',(req,res)=>{
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


// Route dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render('dashboard', {
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.render('index', { error: 'Anda belum login, silahkan login' });
    }
});


//  route logout
router.get('/logout',(req,res)=> {
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
});

// WAJIB DIEKSPOR: Pastikan yang diekspor adalah 'router'
module.exports = router; 
