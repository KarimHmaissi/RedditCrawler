var _ = require("lodash");
var Promise = require("bluebird");
var Request = require("request");

var Bottleneck = require("bottleneck");

var redditBottle = new Bottleneck(1, 2500);;


var gatherLinks = function (subreddit, page) {


	var apiCall = "http://reddit.com/r/" + subreddit + "/top.json#page=" + page;

	var savedLinks = [];


	var saveLink = function (redditLink) {
		RedditLink.create(link).exec(function (redditLink) {
			
		});	
	};

	return new Promise(function (fulfill, reject) {

		
		redditBottle.submit(Request, apiCall, function (error, response, body) {
			
			if(!error && response.statusCode === 200) {

				var parsedBody = JSON.parse(body);

				var i;
				var length = parsedBody.data.children.length;

				for(i = 0; i < length; i++) {

					var rawLink = parsedBody.data.children[i];

					var handler = function (redditLinks) {
						
						if(redditLinks.length < 0) {
							sails.log("already added link")
						} else {
							var redditLink = {

								linkId: parsedBody.data.children[i].data.id,
								numComments: parsedBody.data.children[i].data.numComments,
								permalink: parsedBody.data.children[i].data.permalink,
								created: parsedBody.data.children[i].data.created,
								title: parsedBody.data.children[i].data.title,
								subreddit: subreddit

							};

							savedLinks.push(redditLink);

							saveLink(redditLink);
						}

					}

					RedditLink.find().where({linkId: parsedBody.data.children[i].data.id}).exec(handler);

					

				}


				fulfill(savedLinks);
				

			}


		});


	});
};


var gatherComments =function (subreddit) {
	return new Promise(function (fulfill, reject) {

	});	
};



module.exports = {
	crawlReddit: function (subreddit) {
		
		// return new Promise(function (fulfill, reject) {

			//crawl links and save to db 
			return gatherLinks("javascript", 1)


			//gather comments and save to db




		// });

	}
}