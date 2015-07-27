module.exports = {

	get: function (req, res) {
		
		RedditLink.find().exec(function (err, links) {
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