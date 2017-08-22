/** 
* Security class to handle middleware security 
*
* @module Security
* @namespace Modules
* @class Security
**/
var jwt = require('jsonwebtoken'); 

module.exports = function(){

	/**
	 * Middleware function that can be added to a route to require that the user is authenticated
	 *
	 * Allows the testing of three different type of authenticated entities.
	 *
	 * 1. Client - The main company that has a Contento APP.
	 * 2. Account - The administrators of the system.
	 * 3. User - The users of the mobile app.
	 * 
	 *
	 * @method isAuthenticated
	 * @param {Object} req Holds the Request data for this call
	 * @param {Object} res Response Object for this call
	 * @param {Function} next Callback function to call next in the middle ware
	 *
	 */
	 function isAuthenticated(req, res, next) {
	    // check header or url parameters or post parameters for token
	    var token = null;
	    if(req.body){
	    	token = req.body.token;
	    }
	    if(token==null && req.query){
	    	token = req.query.token;
	    
	    }
	    if(token==null && req.headers){
	    	token = req.headers['x-access-token'];
	    }
	    if (token) {
	        // verifies secret and checks exp
	        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
	            if (err) {
	                res.status(403).json({
	                    success: false,
	                    message: 'Failed to authenticate token.'
	                });
	            } else {
	                // if everything is good, save to request for use in other routes
	                req.decoded = {};
	                req.decoded.objUser = {};
	        		if(decoded.type=='user'){
	        			(app.get('getModel')('user')).find({
			                email:decodedData.email,
			                'meta.isActive':true
			            },function(err,user){
			                if(doc){
			                    // if there is no user
						        // return an error
						        return res.status(403).json({
						            success: false,
						            message: 'Invalid token provided.'
						        });
			                } else {
			                	req.decoded.objUser = user;
			                	req.decoded.authType = 'Account';
			                	if(user.isAdministrator === 1){
			                		req.decoded.authType = 'Admin';
			                	}
			                	if(user.isSuperAdministrator === 1){
			                		req.decoded.authType = 'SuperAdmin';
			                	}
			                    next();
			                }
			            });
	        
	            	}
	        	}
	        });
	    } else {

	        // if there is no token
	        // return an error
	        return res.status(403).json({
	            success: false,
	            message: 'No token provided.'
	        });

	    }
	}

	/**
	 * Middleware function that can be added to a route to require 
	 * that the user is a Super Administrator
	 *
	 * 
	 * @method isSuperAdministrator
	 * @param {Object} req Holds the Request data for this call
	 * @param {Object} res Response Object for this call
	 * @param {Function} next Callback function to call next in the middle ware
	 *
	 */
	 function isSuperAdministrator(req, res, next) {

	    if(req.decoded.authType === 'SuperAdmin' && req.decoded.user.uuid!=='' && req.decoded.user.isAdmin === 1){
	        next();
	    } else {
	        res.status(403).json({
	            success: false,
	            message : "Sorry you do not have permissions to access this function"
	        });
	    }
	 }
	/**
	 * Middleware function that can be added to a route to require
	 * that the user is an Administrator
	 *
	 * @method isAdministrator
	 * @param {Object} req Holds the Request data for this call
	 * @param {Object} res Response Object for this call
	 * @param {Function} next Callback function to call next in the middle ware
	 *
	 */
	function isAdministrator(req, res, next) {
	    if(req.decoded.authType === 'Admin' && req.decoded.user.uuid!==''){
	        next();
	    } else {
	        console.log('Illegal call to Admin only function');
	        res.status(403).json({
	            success: false,
	            message : "Sorry you do not have permissions to access this function"
	        });
	    }
	}
	/**
	 * Middleware function that can be added to a route to require
	 * that the user is an isAccountHolder
	 *
	 * @method isAccountHolder
	 * @param {Object} req Holds the Request data for this call
	 * @param {Object} res Response Object for this call
	 * @param {Function} next Callback function to call next in the middle ware
	 *
	 */
	function isAccountHolder(req, res, next) {
	    if(req.decoded.authType === 'Account' && req.decoded.user.uuid!==''){
	        next();
	    } else {
	        console.log('Illegal call to Admin only function');
	        res.status(403).json({
	            success: false,
	            message : "Sorry you do not have permissions to access this function"
	        });
	    }
	}


	function checkDomain (req,res,next){
		// console.log(req.headers.host);
        var sites = app.get('getModel')('sites');
        sites.findOne({ domains : { $in :[ req.headers.host ]} }, function(err,doc){
            console.log(err);
            console.log(doc);
            res.json({
                success: true
            });
        });
        // var newSite =  new sites();
        // newSite.save();
        // app.get('pages').faq.find(function(err, docs) {
        //     if (err) {//     } else {
               
        //     }
        // });
    }
	return {
		isAuthenticated:isAuthenticated,
		isAdministrator:isAdministrator,
		isSuperAdministrator:isSuperAdministrator
	};
}