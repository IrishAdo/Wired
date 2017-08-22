/**
* This describes the Mongo Document format for Paths.
*
* @module Paths
* @namespace Models
* @class Paths
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Paths', new Schema({ 
    /**
    * @property uuid
    * @type String
    */
    uuid: String, 
    /**
    * @property clientId
    * @type String
    */
    clientId: String, 
    /**
    * @property redirection_paths lists all paths as urls change and handles 404 redirections
    * @type String
    */
    redirection_paths:[String],
    /**
    * @property path
    * @type String
    */
    path:String,
	/**
    * @property meta
    * @type Object
    */
    meta: { type: Schema.Types.ObjectId, ref: 'metadata' }
}));