const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Impor database jika nanti dibutuhkan untuk query CRUD

// 1. BUAT MIDDLEWARE CEK LOGIN
function cekAuth(req, res, next) {
    if (req.session.loggedin) {
        return next(); // Jika sudah login, izinkan lanjut ke halaman nasabah
    } else {
        // Jika belum login, tendang kembali ke halaman login utama dengan pesan error
        return res.render('index', { 
            error: 'Anda harus login terlebih dahulu untuk mengakses halaman nasabah!', 
            layout: false 
        });
    }
}

// Tampil Anggota (Akses URL: /anggota)
router.get('/',cekAuth, (req, res) => {
    if (req.session.loggedin) {
        res.render('nasabah/tampil', {
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.render('index', { error: 'Anda belum login, silahkan login' });
    }
});



router.get('/form-nasabah',(req,res)=>{
    if(req.session.username){
       req.render('nasabah/form',{
            username : req.session.username,
            role : req.session.role
       }); 
    } else {
        res.render('index',{error:'Anda belum login'})
    };

});

module.exports = router;
