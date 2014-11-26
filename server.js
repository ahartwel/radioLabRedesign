var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();




app.use(express.static(__dirname + '/public'));


app.get("/",function(req,res){
    res.sendfile('index.html');

});




app.get('/scrape/:url/:id', function(req, res){
	// Let's scrape Anchorman 2
	url = "http://www.radiolab.org/story/" + req.params.url;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
            var document = cheerio.load(html);
			var title = $(".article-full .title").text();
			var date = $(".article-full .date").text();
			var author = $(".article-full .byline").text();
			var image = $(".story-longimage img").attr("src");
            if (image == null) {
             image = $(".embedded-image img").attr('src');   
            }
            
            var article = "";
            $(".article-description").each(function() {
			article += $(this).html();
                
                
            });
            var mp3=" ";
            mp3 = $(".Download .button").attr("href");
            console.log($(".inline_audioplayer_wrapper").html());
            mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-download");
            
            if (typeof mp3 === 'undefined' || mp3 == "true") {
               mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-url"); 
            }
		}

        

        res.send({name: title, date:  date, author: author, article: article, image: image, img: "shit", id: req.params.id, audio: mp3 })
	})
})



app.get('/scrape2/:url/:id', function(req, res){
	// Let's scrape Anchorman 2
	url = "http://" + decodeURIComponent(req.params.url);

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
            var document = cheerio.load(html);
			var title = $(".article-full .title").text();
			var date = $(".article-full .date").text();
			var author = $(".article-full .byline").text();
			var image = $(".story-longimage img").attr("src");
            if (image == null) {
             image = $(".embedded-image img").attr('src');   
            }
            
            var article = "";
            $(".article-description").each(function() {
			article += $(this).html();
                
                
            });
            var mp3=" ";
            mp3 = $(".Download .button").attr("href");
            console.log($(".inline_audioplayer_wrapper").html());
            mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-download");
            
            if (typeof mp3 === 'undefined' || mp3 == "true") {
               mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-url"); 
            }
		}

        

        res.send({name: title, date:  date, author: author, article: article, image: image, img: "shit", id: req.params.id, audio: mp3 })
	})
})


ar port = process.env.PORT || 3000;
app.listen(port)
console.log('Magic happens on port 8081');
exports = module.exports = app; 	
/*

<div id="audioplayer_idp285280e8ef6c38-6d3d-4fc0-95cd-85b4afba81a9" class="player_element" data-url="http://www.radiolab.org/audio/xspf/383809/" data-width="620" data-title="Shattering Silence and An Eye of God" data-thumbnail="" data-download="http://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/radiolab/radiolab042806c.mp3" data-may-embed="true"></div>
*/