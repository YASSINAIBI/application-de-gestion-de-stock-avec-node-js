var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// rayon section
// display rayon page
router.get('/', function(req, res, next) {
    var sql = "CREATE TABLE if not exists rayon (id INT AUTO_INCREMENT PRIMARY KEY, rayon_name varchar(50), rayon_product varchar(50), created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

    dbConn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        });

    dbConn.query('SELECT * FROM rayon ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('rayon',{data:''});
        } else {
            // render to views/books/index.ejs
            res.render('rayon',{data:rows});
        }
    });
});

// display add rayon page
router.get('/addR', function(req, res, next) {
    // render to add.ejs
    res.render('rayon/add-rayon', {
        rayon_name: '',
        rayon_product: '',
    })
})

module.exports = router;