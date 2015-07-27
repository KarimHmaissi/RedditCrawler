module.exports = {

	start: function () {
		

		if(!typeof req.params.all().subreddit === string) {
			res.json("err");
			return;
		}

		RedditCrawler.crawl(req.params.all().subreddit).then(function (result) {

			res.json(result);

		});

	}

}