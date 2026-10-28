const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Impor database jika nanti dibutuhkan untuk query CRUD

// Tampil Anggota (Akses URL: /anggota)
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('anggota/tampil', {
            username: req.session.username,
            role: req.session.role
        });
    } else {
        res.render('index', { error: 'Anda belum login, silahkan login' });
    }
});



router.get('/form-anggota',(req,res)=>{
    if(req.session.username){
       req.render('anggota/form',{
            username : req.session.username,
            role : req.session.role
       }); 
    } else {
        res.render('index',{error:'Anda belum login'})
    };

});

module.exports = router;
