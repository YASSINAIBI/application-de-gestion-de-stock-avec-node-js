var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// rayon section
// display rayon page
router.get('/', function(req, res, next) {
    var sql = "CREATE TABLE if not exists rayon (id INT AUTO_INCREMENT PRIMARY KEY, rayon_name INT, rayon_product varchar(50), created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

    dbConn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        });

    dbConn.query('SELECT * FROM rayon ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('rayon',{data:''});
        } else {
            // render to views/products/index.ejs
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

// add a new rayon
router.post('/addR', function(req, res, next) {

    let rayon_name = req.body.rayon_name;
    let rayon_product = req.body.rayon_product;

    let errors = false;

    if(rayon_name.length === 0 || rayon_product.length === 0){
        errors = true;

        // set flash message
        req.flash('error', "Please enter rayonName and rayonProduct");
        // render to add.ejs with flash message
        res.render('rayon/add-rayon', {
            rayon_name: rayon_name,
            rayon_product: rayon_product
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            rayon_name: rayon_name,
            rayon_product: rayon_product
        }

        // insert query
        dbConn.query('INSERT INTO rayon SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('rayon/add-rayon', {
                    rayon_name: rayon_name,
                    rayon_product: rayon_product
                })
            } else {
                req.flash('success', 'product successfully added');
                res.redirect('/rayon');
            }
        })
    }
})


// display edit rayon
router.get('/editR/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM rayon WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'product not found with id = ' + id)
            res.redirect('/rayon')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('rayon/edit-rayon', {
                title: 'Edit rayon',
                id: rows[0].id,
                rayon_name: rows[0].rayon_name,
                rayon_product: rows[0].rayon_product
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let rayon_name = req.body.rayon_name;
    let rayon_product = req.body.rayon_product;
    let errors = false;

    if(rayon_name.length === 0 || rayon_product.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter product and unitCoast");
        // render to add.ejs with flash message
        res.render('rayon/edit-rayon', {
            id: req.params.id,
            rayon_name: rayon_name,
            rayon_product: rayon_product
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            rayon_name: rayon_name,
            rayon_product: rayon_product
        }
        // update query
        dbConn.query('UPDATE rayon SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('rayon/edit-rayon', {
                    id: req.params.id,
                    rayon_name: form_data.rayon_name,
                    rayon_product: form_data.rayon_product
                })
            } else {
                req.flash('success', 'rayon successfully updated');
                res.redirect('/rayon');
            }
        })
    }
})

// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
    let rayon_name = req.body.rayon_name;

        // rayon.rayon_name = products.rayon_N
var sql = "DELETE products, rayon FROM products inner join rayon on rayon.rayon_name = products.rayon_N";
            dbConn.query(sql,[1, 1], function(err, result, fields) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to products page
            res.redirect('/rayon')
        } else {
            // set flash message
            req.flash('success', 'rayon successfully deleted! ID = ' + id)
            // redirect to products page
            res.redirect('/rayon')
        }
    });
    });
module.exports = router;