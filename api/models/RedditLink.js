var RedditLink = {
	schema: true,


	attributes: {

		linkId: {type: "string", unique: true, notEmpty: true},
		numComments: {type: "integer"},
		permalink: {type: "string"},
		created: {type: "date"},
		title: {type: "string"},
		subreddit: {type: "string"},

		checked: {type: "boolean", defaultsTo: false}

	}


}

module.exports = RedditLink;