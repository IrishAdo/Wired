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
    app.get('/admin/test', //app.get('security').isAuthenticated, 
    function(req, res) {
        // console.log(req);
        //    
        var section = new (app.get('getModel')('sections'))();
        var metadata = new (app.get('getModel')('metadata'))();
        metadata.dateCreated = new Date();
        metadata.dateUpdated = new Date();
        metadata.isActive = true;
        section.uuid = uuid.v4();
        section.clientId = req.session.site.uuid;
        section.pathId = 'b32f78be-7cdb-4fc5-99ce-e821b3342872';
        section.title = "Welcome";
        section.body = "<p>Welcome to yoru website</p>";
        section.meta = metadata;
        section.save();
        
        console.log(section);
        
        res.json({
            success: true,
            data: section
        });
    });
    

    
}