var http = require("http");
var port = 3000;
var express = require('express');
var ip = "localhost";
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
app.directory = __dirname;
app.set('views', path.join(app.directory, '/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(app.directory+'/'));

app.get('/api/url', function(req, res){
  var input = req.query.url;
  var youtubePatt = /youtube/i;
  var youtubeVidPatt = /v=/i;
  var linkPatt = /http/i;
  var link = input;

	// Prepends http if it's not already in the string
  if (!linkPatt.test(input)){
  	input = 'http://'+input;
  	link = 'http://'+link;
  }
	request(input, function(err, resp, body){
	  $ = cheerio.load(body);
	  var title = $('title').text() || undefined;
	  var video_id = undefined;

	  // If it's a youtube link
		if (youtubePatt.test(input) && youtubeVidPatt.test(input)){
		  video_id = input.split('v=')[1];
		  var ampersandPosition = video_id.indexOf('&');
			if(ampersandPosition != -1) {
			  video_id = video_id.substring(0, ampersandPosition);
			}
		} else {
		  var img = $('meta[property="og:image"]').attr('content') || $('img').attr('src') || undefined;  
		  // Basic check for image path
		  if (img && !linkPatt.test(img)){
		  	img = input + img;
		  }
		};
		if (!img && !video_id) link = undefined;
  	res.send({title: title, imageUrl: img, video_id: video_id, link: link})
	});
});

var server = http.createServer(app);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);