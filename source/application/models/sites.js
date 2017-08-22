/**
* This describes the Mongo Document format for FAQs.
*
* @module FAQs
* @namespace Models
* @class FAQs
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Sites', new Schema({ 
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
    * @property label
    * @type String
    */
    label:String, 
    /**
    * @property path
    * @type String
    */
    domains:[ String ] ,
    /**
    * @property meta
    * @type Object
    */
    meta: { type: Schema.Types.ObjectId, ref: 'metadata' }
}));