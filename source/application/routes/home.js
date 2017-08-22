/**
 * This is the description for my class.
 *
 * @module Modules
 * @class home
 * @namespace Route
 */
var uuid = require('node-uuid');
/*
This module will handle the activity of the home page.
*/
module.exports = function(app) {

    app.get('/',  function(req, res) {
        
                res.status(403).json({
                    success: false,
                    message: "Sorry there was an error this page hasn't been coded yet"
                });
        
   });

    
}