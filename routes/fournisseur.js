var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// fournisseur section
// display fournisseur page
router.get('/', function(req, res, next) {
    var sql = "CREATE TABLE if not exists fournisseur (id INT AUTO_INCREMENT PRIMARY KEY, name varchar(50), phone varchar(50), email varchar(50), created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";

    dbConn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
        });

    dbConn.query('SELECT * FROM fournisseur ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('fournisseur',{data:''});
        } else {
            // render to views/products/index.ejs
            res.render('fournisseur',{data:rows});
        }
    });
});

// display add fournisseur page
router.get('/addF', function(req, res, next) {
    // render to add.ejs
    res.render('fournisseur/add-fournisseur', {
        name: '',
        phone: '',
        email: ''
    })
})

// add a new fournisseur
router.post('/addF', function(req, res, next) {

    let fournisseur_name = req.body.name;
    let fournisseur_phone = req.body.phone;
    let fournisseur_email = req.body.email;

    let errors = false;

    if(fournisseur_name.length === 0 || fournisseur_phone.length === 0 || fournisseur_email.length === 0){
        errors = true;

        // set flash message
        req.flash('error', "Please enter rayonName and rayonProduct");
        // render to add.ejs with flash message
        res.render('fournisseur/add-fournisseur', {
            name: fournisseur_name,
            phone: fournisseur_phone,
            email: fournisseur_email
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: fournisseur_name,
            phone: fournisseur_phone,
            email: fournisseur_email
        }

        // insert query
        dbConn.query('INSERT INTO fournisseur SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('fournisseur/add-fournisseur', {
                    name: fournisseur_name,
                    phone: fournisseur_phone,
                    email: fournisseur_email
                })
            } else {
                req.flash('success', 'product successfully added');
                res.redirect('/fournisseur');
            }
        })
    }
})


// display edit fournisseur
router.get('/editF/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM fournisseur WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'product not found with id = ' + id)
            res.redirect('/fournisseur')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('fournisseur/edit-fournisseur', {
                title: 'Edit fournisseur',
                id: rows[0].id,
                name: rows[0].fournisseur_name,
                phone: rows[0].fournisseur_phone,
                email: rows[0].fournisseur_email
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let fournisseur_name = req.body.name;
    let fournisseur_phone = req.body.phone;
    let fournisseur_email = req.body.email;
    let errors = false;

    if(fournisseur_name.length === 0 || fournisseur_phone.length === 0 || fournisseur_email.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter product and unitCoast");
        // render to add.ejs with flash message
        res.render('rayon/edit-rayon', {
            id: req.params.id,
            name: fournisseur_name,
            phone: fournisseur_phone,
            email: fournisseur_email
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            name: fournisseur_name,
            phone: fournisseur_phone,
            email: fournisseur_email
        }
        // update query
        dbConn.query('UPDATE fournisseur SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('fournisseur/edit-fournisseur', {
                    id: req.params.id,
                    name: form_data.fournisseur_name,
                    phone: form_data.fournisseur_phone,
                    email: form_data.fournisseur_email
                })
            } else {
                req.flash('success', 'rayon successfully updated');
                res.redirect('/fournisseur');
            }
        })
    }
})


// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM fournisseur WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to products page
            res.redirect('/fournisseur')
        } else {
            // set flash message
            req.flash('success', 'rayon successfully deleted! ID = ' + id)
            // redirect to products page
            res.redirect('/fournisseur')
        }
    })
})

module.exports = router;