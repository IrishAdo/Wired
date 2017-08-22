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
module.exports = mongoose.model('metadata', new Schema({ 
    /**
    * @property title
    * @type String 
    */
    title: String,
    /**
    * @property description
    * @type String 
    */
    description: String,
    /**
    * @property accessLevel
    * @type String [public|private]
    */
    accessLevel: String,
    /**
    * @property isActive
    * @type Boolean
    */
    isActive: Boolean,
    /**
    * @property isDeleted
    * @type Boolean
    */
    isDeleted: Boolean,
    /**
    * @property dateCreated
    * @type Date
    */
    dateCreated: Date,
    /**
    * @property dateUpdated
    * @type Date
    */
    dateUpdated: Date,
    /**
    * @property datePublished
    * @type Date
    */
    datePublished: Date,
    /**
    * @property dateUnPublished
    * @type Date
    */
    dateUnPublished: Date
}));