var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display products page
router.get('/', function(req, res, next) {
    var sql = "CREATE TABLE if not exists products (id INT AUTO_INCREMENT PRIMARY KEY, product_name varchar(50), unit_coast float, rayon_N INT, created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

    dbConn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        });

    dbConn.query('SELECT * FROM products ORDER BY id desc',function(err,rows)  {
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('products',{data:''});
        } else {
            // render to views/products/index.ejs
            res.render('products',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('products/add', {
        product_name: '',
        unit_coast: '',
        rayon_N: ''
    })
})
// add a new book
router.post('/add', function(req, res, next) {

    let product_name = req.body.product_name;
    let unit_coast = req.body.unit_coast;
    let rayon_number = req.body.rayon_N;



    let errors = false;

    if(product_name.length === 0 || unit_coast.length === 0 || rayon_number.length === 0 ){
        errors = true;

        // set flash message
        req.flash('error', "Please enter productname and unit coast");
        // render to add.ejs with flash message
        res.render('products/add', {
            product_name: product_name,
            unit_coast: unit_coast,
            rayon_N: rayon_number
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            product_name: product_name,
            unit_coast: unit_coast,
            rayon_N: rayon_number
        }

        // insert query
        dbConn.query('INSERT INTO products SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('products/add', {
                    product_name: form_data.product_name,
                    unit_coast: form_data.unit_coast,
                    rayon_N: form_data.rayon_number
                })
            } else {
                req.flash('success', 'product successfully added');
                res.redirect('/products');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM products WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'product not found with id = ' + id)
            res.redirect('/products')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('products/edit', {
                title: 'Edit Book',
                id: rows[0].id,
                product_name: rows[0].product_name,
                unit_coast: rows[0].unit_coast,
                rayon_N: rows[0].rayon_number
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let product_name = req.body.product_name;
    let unit_coast = req.body.unit_coast;
    let rayon_number = req.body.rayon_N;
    let errors = false;

    if(product_name.length === 0 || unit_coast.length === 0 || rayon_number.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter product and unitCoast");
        // render to add.ejs with flash message
        res.render('products/edit', {
            id: req.params.id,
            product_name: product_name,
            unit_coast: unit_coast,
            rayon_N: rayon_number
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            product_name: product_name,
            unit_coast: unit_coast,
            rayon_N: rayon_number
        }
        // update query
        dbConn.query('UPDATE products SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('products/edit', {
                    id: req.params.id,
                    product_name: form_data.product_name,
                    unit_coast: form_data.unit_coast,
                    rayon_N: form_data.rayon_number
                })
            } else {
                req.flash('success', 'product successfully updated');
                res.redirect('/products');
            }
        })
    }
})

// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM products WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to products page
            res.redirect('/products')
        } else {
            // set flash message
            req.flash('success', 'product successfully deleted! ID = ' + id)
            // redirect to products page
            res.redirect('/products')
        }
    })
})



module.exports = router;