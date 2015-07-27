module.exports = {

	get: function (req, res) {
		sails.log("hit MainController/get");
		RedditLink.find().exec(function (links) {
			res.json(links)
		});

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