module.exports = {

	getLinks: function (req, res) {
		sails.log("hit MainController/get");
		RedditLink.find().then(function (links) {
			res.json(links)
		}).catch(sails.log);

	},

	getComments: function (req, res) {
		Comment.find().then(function (comments) {
			res.render("comments.ejs", comments);
		})
	},

	start: function (req, res) {
		

		if(!typeof req.params.all().subreddit === "string") {
			res.json("err");
			return;
		}

		RedditCrawler.crawlReddit(req.params.all().subreddit).then(function (result) {

			res.json(result);

		});

	}

}