var Comment = {
	schema: true,


	attributes: {

		permalink: {type: "string"},
		linkId: {type: "string"},

		commentId: {type: "string", unique: true, notEmpty: true},
		body: {type: "string"},
		name: {type: "string"},
		ups: {type: "integer"},





	}


}

module.exports = Comment;