/**
 * This is the description for my class.
 *
 * @module Modules
 * @class FAQ
 * @namespace Route
 */
// var FaqsObject = require('../models/faq');
var uuid = require('node-uuid');
/*
Define the module 
*/
module.exports = function(app) {

    // --------------------------------------------------------------------------------
    // API: http://localhost:8080/api/faqs
    // Method: GET
    // AUTH : YES
    // Desc: This function will retrieve your Faqs
    // --------------------------------------------------------------------------------
    app.get('/api/faq', app.get('security').isAuthenticated, function(req, res) {
        var page =  new (app.get('getModel')('page'))();
        var metadata = new (app.get('getModel')('metadata'))();
        metadata.dateCreated = new Date();
        metadata.dateUpdated = new Date();
        metadata.title = 'Home Page';
        metadata.save();
        page.uuid = uuid.v4();
        page.clientId = uuid.v4();
        page.label = "Home Page";
        page.meta = metadata;
        page.save();
        // app.get('pages').faq.find(function(err, docs) {
        //     if (err) {
        //         res.status(403).json({
        //             success: false,
        //             message: "Sorry there was an error"
        //         });
        //     } else {
                res.json({
                    success: true,
                    data: page
                });
        //     }
        // });
    });

    
}