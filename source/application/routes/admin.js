/**
 * This is the description for my class.
 *
 * @module Modules
 * @class admin
 * @namespace Route
 */
var uuid = require('node-uuid');
/*
Define the module 
*/
module.exports = function(app) {

    /**
     * This route will display the login form.
     *
     * VERB :: GET
     * 
     * SECURITY ::  public  
     */
    app.get('/admin/login',  function(req, res) {
        res.render('admin/login', {
            session: req.session,
            url: req.url,
            domain : req.query.domain
        });
    });
    /**
     * This route will process the login form.
     *
     * VERB :: POST
     * 
     * SECURITY ::  public  
     */
    app.post('/admin/login',  function(req, res) {
        var errors=[];
        var errorCounter=0;
        console.log(req.body);
        if(req.body.email==''){
            errorCounter++;
            errors['email'] ='You must supply a valid email address'; 
        }
        if(req.body.password==''){
            errorCounter++;
            errors['password'] = 'You must supply a password'; 
        }
        if (errorCounter>0){
            res.render('admin/login', {
                session: req.session,
                url: req.url,
                domain : req.query.domain,
                errors : errors
            });
        } else {
            (app.get('getModel')('administrator')).find({
                email:email,
                'meta.isActive':true
            },function(err,user){
                if(doc){
                    res.redirect("/yes");
                } else {
                    res.render('admin/login', {
                        session: req.session,
                        url: req.url,
                        domain : req.query.domain,
                        errors : ["Sorry incorrect login details"]
                    });
                }
            });
        }
    });
    /**
     * This route will register a new site
     *
     * @method GET::/admin/registerNewSite'
     * @return {Object} status should have a value of true
     */
     app.get('/admin/registerNewSite',  function(req, res) {
        console.log('new site');
        
        res.render('admin/newsite', {
            session: req.session,
            url: req.url,
            domain : req.query.domain
        });
        console.log('new site 2');
    });

    
}