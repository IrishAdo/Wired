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
module.exports = mongoose.model('Sections', new Schema({ 
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
    * @property pathId
    */
    pathId:String,
    /**
    * @property title
    * @type String
    */
    title:String,
    /**
    * @property body
    * @type String
    */
    body:String,
	/**
    * @property meta
    * @type Object
    */
    meta: { type: Schema.Types.ObjectId, ref: 'metadata' }
}));