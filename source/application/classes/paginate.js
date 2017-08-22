/** 
* Security class to handle middleware security 
*
* @module Security
* @namespace Modules
* @class Security
**/

module.exports = function(app){

	/**
	 * paginate results function ad mongo allows a similar request model it turns out 
	 * we can do this as one block of code 
	 *
	 * @param {Object} The Mongoose Model to query
	 * @param {Object} the find statement
	 * @param Boolean override the pagination sets limit = 1000000
	 * @param {Object} the sort statement
	 * @param {Object} req Holds the Request data for this call
	 * @param {Object} res Response Object for this call
	 * @param {Function} next Callback function to call next in the middle ware
	 *
	 */
	function getPaginatedResults(SearchObject, searchTerms, limitOverRide, sort, req, res){
		var offset = 0;
        var limit = 100;
        if (req.query.offset) {
            offset = req.query.offset * 1;
        }
        if (req.query.limit) {
            limit = req.query.limit * 1;
        }
        if(limitOverRide){
        	limit = 1000000;
        }
        if(!sort){
        	sort = {};
        }
		SearchObject
            .find(searchTerms)
            .sort(sort)
            .skip(offset)
            .limit(limit)
            .exec(function(err, resultsObj) {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: "Sorry there was an error.",
                        error: err
                    });
                } else {
                    if (resultsObj) {
                        SearchObject.find(searchTerms).count(function(err, numOfRecords) {
                            if (err) {
                                // console.log('Lead failed to update.');
                                res.status(403).json({
                                    success: false,
                                    message: "Sorry there was an error"
                                });
                            } else {
                                res.json({
                                    success: true,
                                    count: numOfRecords,
                                    limit: limit,
                                    offset: offset,
                                    data: resultsObj
                                });
                            }
                        })
                    } else {
                        res.status(403).json({
                            success: false,
                            message: "Sorry there was an error"
                        });
                    }
                }
            });
    }

    function getPaginatedResultsWithPopulate(SearchObject, searchTerms, populate, limitOverRide, sort, req, res){
		var offset = 0;
        var limit = 10;
        if (req.query.offset) {
            offset = req.query.offset * 1;
        }
        if (req.query.limit) {
            limit = req.query.limit * 1;
        }
        if(limitOverRide){
        	limit = 1000000;
        }
        if(!sort){
        	sort = {};
        }
		SearchObject
            .find(searchTerms)
            .populate(populate)
            .sort(sort)
            .skip(offset)
            .limit(limit)
            .exec(function(err, resultsObj) {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: "Sorry there was an error.",
                        error: err
                    });
                } else {
                    if (resultsObj) {
                        SearchObject.find(searchTerms).count(function(err, numOfRecords) {
                            if (err) {
                                // console.log('Lead failed to update.');
                                res.status(403).json({
                                    success: false,
                                    message: "Sorry there was an error"
                                });
                            } else {
                                res.json({
                                    success: true,
                                    count: numOfRecords,
                                    limit: limit,
                                    offset: offset,
                                    data: resultsObj
                                });
                            }
                        })
                    } else {
                        res.status(403).json({
                            success: false,
                            message: "Sorry there was an error"
                        });
                    }
                }
            });
    }
	return {
		getPaginatedResults:getPaginatedResults,
		getPaginatedResultsWithPopulate:getPaginatedResultsWithPopulate
	};
}