var _ = require("lodash");
var Promise = require("bluebird");
var Request = require("request");

var Bottleneck = require("bottleneck");

var redditBottle = new Bottleneck(1, 2500);;

var afterThisPost = "";

var minLength = 200;
var minUpvotes = 10;

var createLink = function (redditLink) {
	RedditLink.create(redditLink).then(function (savedLink) {
		sails.log("saved link: " + savedLink.linkId);
	}).catch(sails.log);
};

var saveLink = function (redditLink) {
	redditLink.save().then(function (savedLink) {
		// sails.log("saved link: " + savedLink.linkId);
	}).catch(sails.log);
};


var gatherLinks = function (subreddit, count) {

	if(afterThisPost != "") {
		var apiCall = "https://www.reddit.com/r/" + subreddit + "/top.json"  
		+ "?sort=top&t=all&limit=" + count + "&count=" + count + "&after=" + afterThisPost;
	} else {
		var apiCall = "https://www.reddit.com/r/" + subreddit + "/top.json"  
		+ "?sort=top&t=all&limit=" + count + "&count=" + count;
	}

	// https://www.reddit.com/r/javascript/top/.json?sort=top&t=all&limit=100
	

	var savedLinks = [];


	return new Promise(function (fulfill, reject) {

		sails.log("adding in new link request");
		redditBottle.submit(Request, apiCall, function (error, response, body) {
			
			if(!error && response.statusCode === 200) {

				var parsedBody = JSON.parse(body);


				var i;
				var length = parsedBody.data.children.length;

				sails.log("Got reponse from reddit server with " + length + "links");


				for(i = 0; i < length; i++) {

					var redditLink = {

						linkId: parsedBody.data.children[i].data.id,
						numComments: parsedBody.data.children[i].data.numComments,
						permalink: parsedBody.data.children[i].data.permalink,
						created: new Date(parsedBody.data.children[i].data.created * 1000),
						title: parsedBody.data.children[i].data.title,
						subreddit: subreddit

					};

					if(i === length - 1) {
						var afterThisPost = parsedBody.data.children[i].data.id

						sails.log("reached end adding after id: " + afterThisPost);
					}

					savedLinks.push(redditLink);

					saveLink(redditLink);

				}


				fulfill(savedLinks);
				

			}


		});


	});
};



var createComment = function (redditLink, commment) {

	var commentToSave = {
		permalink: redditLink.permalink,
		linkId: redditlink.linkId,

		commentId: comment.id,
		body: comment.body,
		ups: comment.ups,
		name: comment.name 
	};

	Comment.create(commentToSave).then(function (savedComment) {
	}).catch(sails.log);
};


var parseCommentReplies = function (redditLink, replies) {
	var comments = replies.data.children;


	var i;
	var length = comments.length;

	for(i = 0; i < length; i++) {
		var comment = comments[i];

		if(checkComment(comment.data)) {
			sails.log("A replied comment has passed check and will be saved");
			createComment(redditlink, comment.data);
		}

		// check if has comment children
		if(!comment.data.replies === "") {
			// comment has replies
			sails.log("comment has replies");
			parseCommentReplies(redditlink, comment.data.replies);
		}

	}
	
};

var checkComment = function (commentData) {
	if(commentData.ups > minUpvotes 
		&& commentData.body.length > minLength) {
		return true;
	} else {
		return false;
	}
}

var gatherComments = function (redditlink) {
	return new Promise(function (fulfill, reject) {


		//download comments
		redditBottle.submit(Request, apiCall, function (error, response, body) {

			if(!error && response.statusCode === 200) {
				var parsedBody = JSON.parse(body);

				var commentsToParse = parsedBody[1].data.children;


				var i;
				var length = commentsToParse.length;


				sails.log("Got reponse from reddit server with " + length + "root comments");

				for(i = 0; i < length; i++) {

					var parsedComment = commentsToParse[i];


			
					//check comment body length and upvotes
					if(checkComment(parsedComment.data)) {
						sails.log("comment has passed checks and will be saved");
						createComment(redditlink, parsedComment.data);
					}


					// check if has comment children
					if(parsedComment.data.replies === "") {
						// comment has replies
						sails.log("comment has replies");
						parseCommentReplies(redditlink, parsedComment.data.replies);
					}
	

					
				}

				redditLink.checked = true;
				saveLink(redditlink);

				fulfill();
			}


		});

		


		
	});	
};



module.exports = {
	crawlReddit: function (subreddit) {
		
		// return new Promise(function (fulfill, reject) {

		// 	var handler = function (links) {
		// 		Promise.each(links, function (redditLink) {
		// 			return gatherComments(redditLink);

		// 		}).then(fulfill);
		// 	}

		// 	RedditLink.find().where({subreddit: subreddit}).limit(1).exec(handler);

		// });




		return gatherLinks("javascript", 100);

	}
}