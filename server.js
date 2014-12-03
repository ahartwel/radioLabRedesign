var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var RiakClient = require("riak");

// list of riak servers you'd like to load balance over (poolee handles this).
var servers = ["127.0.0.1:8098"]

// should be unique, used by riak if you don't supply a vector clock
// default value: random integer
var client_id = "docs-client"

// informative name for logging purposes etc
var pool_name = "docs-pool"

var client = new RiakClient(servers, client_id, pool_name);

client.debug_mode = false;
//
//var value = { riak: "is fun" }
//    bucket = "bucket_1",
//    url = "/riak/" + bucket,
//    options = {};
//
//client.post(url, JSON.stringify(value), function(err, res, obj) {
//   
//    var uri = res.headers.location.split("/"),
//        key = uri[uri.length - 1];
//console.log(err);
//    console.log(key);
//    
//    
//});





//client.get("bucket_1", "YrUAJI0SluL4tfCKHbZkwkguEds", {}, function(err, res, obj) {
// 
//    console.log(err);
//    console.log(Object.keys(obj).length);
//    
//});
//
//
//
//client.modify("bucket_1", "YrUAJI0SluL4tfCKHbZkwkguEds", function mutator(old, done) {
//    var newobj = old || {};
//    newobj.newArticle = "";
//    newobj.counter++;
//      console.log(Object.keys(newobj).length);
//    done(newobj);
//}, {}, function (err, res, obj) {
//    console.error(res.statusCode + ": ", obj);
//    //process.exit();
//});


//client.del("Podcasts", "casts", function(err,res,obj) {
// console.log(err);   
//    
//})

//client.put("Podcasts", "casts", ["haha"], {}, function(err, res, obj) {
//// console.log(err);
//    //console.log(obj);
//    //console.log(res);
//    
//    
//})

//
//
//client.append("buket_1", "test",{niak: "test"}, {}, function(err, res, obj) {
//    
// //console.log(err);
//   // console.log(obj);
//    
//})



client.get("Podcasts", ["casts"], {}, function(err, res, obj) {
   console.log(obj); 
    
    
});

//client.get("bucket_1", "YrUAJI0SluL4tfCKHbZkwkguEds", {}, function(err, res, obj) {
// 
//    console.log(err);
//    console.log(Object.keys(obj).length);
//    
//});


app.use(express.static(__dirname + '/public'));


app.get("/",function(req,res){
    res.sendfile('index.html');

});


 
app.get('/podcasts', function(req, res) {
    
    var ress = res;
 
client.get("Podcasts", ["casts"], {}, function(err, res, obj) {
   console.log(obj);
    console.log("asdasd");
    ress.send(obj);
    
}); 
    
    
    
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

         var video = false;
            
            $(".article-bottom-tags").find("ul").find("li").each(function() {
                
               if ($(this).text()=="video") {
                video = true;   
               }
                
            });

        res.send({name: title, date:  date, author: author, article: article, image: image, img: "shit", id: req.params.id, audio: mp3, video: video })
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
            
            if (title==undefined || title==null || title=="") {
               title = $(".story-headergroup .title").text(); 
                
            }
            
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
           
            mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-download");
            
            if (typeof mp3 === 'undefined' || mp3 == "true") {
               mp3 = $(".inline_audioplayer_wrapper").children(".player_element").attr("data-url"); 
            }
            
            
           
            
            
		}

//        client.append("Podcasts", "casts",{name: title, date:  date, author: author, article: article, image: image, img: "shit", id: req.params.id, audio: mp3 }, {}, function(err, res, obj) {
//    
// //console.log(err);
//   // console.log(obj);
//    
//})

        res.send({name: title, date:  date, author: author, article: article, image: image, img: "shit", id: req.params.id, audio: mp3 })
	})
})


var port = process.env.PORT || 8081;
app.listen(port)
console.log('Magic happens on port 8081');
exports = module.exports = app; 	
/*

<div id="audioplayer_idp285280e8ef6c38-6d3d-4fc0-95cd-85b4afba81a9" class="player_element" data-url="http://www.radiolab.org/audio/xspf/383809/" data-width="620" data-title="Shattering Silence and An Eye of God" data-thumbnail="" data-download="http://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/radiolab/radiolab042806c.mp3" data-may-embed="true"></div>
*/