var _ = require("lodash");
var Promise = require("bluebird");
var Request = require("request");

var Bottleneck = require("bottleneck");

var redditBottle = new Bottleneck(1, 2500);;


var gatherLinks = function (subreddit, page) {


	var apiCall = "http://www.reddit.com/r/" + subreddit + "/top.json#page=" + page;

	var savedLinks = [];


	var saveLink = function (redditLink) {
		RedditLink.create(redditLink).then(function (savedLink) {
			sails.log("saved link: " + savedLink.linkId);
		}).catch(sails.log);
	};

	return new Promise(function (fulfill, reject) {

		
		redditBottle.submit(Request, apiCall, function (error, response, body) {
			
			if(!error && response.statusCode === 200) {

				var parsedBody = JSON.parse(body);

				// sails.log(parsedBody);

				var i;
				var length = parsedBody.data.children.length;

				sails.log("length+++++   " + length);

				for(i = 0; i < length; i++) {

					// var rawLink = parsedBody.data.children[i];

			/*		var handler = function (err, redditLinks) {
						
						if(redditLinks.length > 0) {
							sails.log("already added link")
						} else {

						}

					}*/

					// RedditLink.find().where({linkId: parsedBody.data.children[i].data.id}).exec(handler);

					sails.log(i);
					// sails.log(parsedBody.data.children[i]);

					var redditLink = {

						linkId: parsedBody.data.children[i].data.id,
						numComments: parsedBody.data.children[i].data.numComments,
						permalink: parsedBody.data.children[i].data.permalink,
						created: new Date(parsedBody.data.children[i].data.created * 1000),
						title: parsedBody.data.children[i].data.title,
						subreddit: subreddit

					};

					savedLinks.push(redditLink);

					saveLink(redditLink);

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