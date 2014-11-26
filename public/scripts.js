console.log("shitSticks");

var stories = [];
        var stories2  =  [];
   var interval;
var feedcontainer=document.getElementById("feed")
var feedurl="http://feeds.wnyc.org/radiolab?format=xml"
var feedlimit=10
var rssoutput="<h2>Latest NPR Business News:</h2><ul>";
    
var toucher, podcast;


    function rssfeedsetup(){
var feedpointer=new google.feeds.Feed(feedurl)
feedpointer.setNumEntries(25)
feedpointer.load(displayfeed1)
}
        
           function rssfeedsetup2(){
var feedpointer=new google.feeds.Feed("http://www.radiolab.org/feeds/channels/radiolab/radiolab-blogland")
feedpointer.setNumEntries(40)
feedpointer.load(displayfeed2)
}




       

        window.onload=function(){
             toucher = new touchInput();  
            podcast = new podcasts();
            
            
                rssfeedsetup();
                rssfeedsetup2();
            
            document.getElementById("podcasts").scrollIntoView();
            
            oldScroll = document.getElementById("contentContainer").scrollLeft; 
            console.log("estst");
            var hammertime = new Hammer(document.getElementById("container"), { direction: Hammer.DIRECTION_ALL, threshold: 200 });
                hammertime.on('pan', function(ev) {
                    toucher.swiped(ev);
                    });
            
            
            requestAnimationFrame(animate);
            
}

        function animate() {
            
            
            
            toucher.update();
            requestAnimationFrame(animate);
        }
        
     


    
    function podcasts() {
        
        this.casts = [];
        
        
        
        this.addCast = function(title, image,  excerpt, mp3) {
            
         this.casts[this.casts.length] = [];   
         this.casts[this.casts.length - 1].title = title;   
         this.casts[this.casts.length - 1].image = image;
         this.casts[this.casts.length - 1].excerpt = excerpt;
         this.casts[this.casts.length - 1].mp3 = mp3;
            
         this.casts[this.casts.length - 1].html = "<div class='podcastContainer'><h4>" + title + "</h4>";   
         this.casts[this.casts.length - 1].html += "<div class='podcastContainer'><p class='excerpt' number='" + (this.casts.length - 1) + "'></p>";
         this.casts[this.casts.length - 1].html += "<a href='#' class='readMore'>Read More</a><div class='podcastImage' style='background: url(" + image + ") no-repeat center center fixed; webkit-background-size: cover; background-size: cover;'>";
         this.casts[this.casts.length - 1].html += "<img class='playButton' src='images/play.svg'><img sclass='addToPlaylist' src='images/addToPlayList.svg'></div></div></div>";
            
        document.getElementById("podcasts").innerHTML  += this.casts[this.casts.length-1].html;
         
            var eles = document.getElementsByClassName('excerpt');
            var casts = document.getElementsByClassName('podcastContainer');
            var imgs = document.getElementsByClassName("podcastImage");
            
            for (var i = 0; i <eles.length;i++) {
               // this.casts[i].element = casts[i];
             if (eles[i].getAttribute("number")==(this.casts.length - 1)) {
                 imgs[i].style.backgroundImage = "url(" + image + ") no-repeat center center fixed"
                 eles[i].textContent=strip(this.casts[this.casts.length - 1].excerpt);
             }
                
            }
            
            
            
        }
        
        
        
    }
    

       

    function touchInput() {
        
        this.oldScroll = 0;
        this.scrollSpeed = 0;
        this.justSwiped = false;
        this.scrollCount=0; 
        this.timeOut;
        this.inChange=true;
        
        this.state = 1;
        
        this.headPos = 0;
        
        
        
        document.getElementById("aboutNav").addEventListener("click", function() {
            console.log(toucher.state);
        if (toucher.state==2) {
         toucher.state=1;   
        } else {
         toucher.state=2;   
        }
        
        }); 
        
        document.getElementById("sectionsNav").addEventListener("click", function() {
            
        if (toucher.state==0) {
         toucher.state=1;   
        } else {
         toucher.state=0;   
        }
        
        });
        
        
        this.update = function() {
            if (this.inChange) {
            var conCon = document.getElementById("contentContainer");
            var header = document.getElementById("header");
            switch(this.state) {
                    
             case 0:
                conCon.scrollLeft=lerp(conCon.scrollLeft,0,.25);  
                    
                    header.style.transform = "translate(" + (window.innerWidth - 21) + "px, -7px)";
                    //console.log("translate(" + this.headPos + ", -7px)")
                    
                    break;
             case 1:
                        conCon.scrollLeft=lerp(conCon.scrollLeft,window.innerWidth,.25);    
             
                    header.style.transform = "translate(" + 0 + "px, -7px)";
                   // console.log("translate(" + this.headPos + ", -7px)")
                    break;
                    
            case 2:
                    
      conCon.scrollLeft=lerp(conCon.scrollLeft,window.innerWidth*2,.25);               
                    
                     
                    header.style.transform = "translate(" + (-window.innerWidth + 21) + "px, -7px)";
                  //  console.log("translate(" + this.headPos + ", -7px)")
                    
                    break;                   
                    
            }
            
            
            }
        }
        
        
        this.swiped = function (ev) {
          console.log(ev);
            if (ev.deltaX>100 || ev.deltaX<-100) {
            if (this.justSwiped==false) {
            if (ev.direction==4) {
             if (this.state>0) {
              this.state-=1; 
                this.inChange=true;
             }
                
            }
             
            if (ev.direction==2) {
             if (this.state<2) {
              this.state+=1;   
              this.inChange=true;
             }
                
            }
            this.justSwiped=true;
            
            }
            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(function() {
                console.log("true");
                toucher.justSwiped=false;
            }, 550);
            
        }
        
        }
        
    }

        
        
        function displayfeed2(result){
if (!result.error){
var thefeeds=result.feed.entries;
    
for (var i=0; i<thefeeds.length-1; i++) {
  

   
    var urls = thefeeds[i].link.split("/");
 console.log(urls[4]);
    $.get( "../scrape/" + urls[4] + "/" + i, function( data ) {
    console.log(data);
         stories2[data.id] =data; 
      
   
    });
    
//rssoutput+="<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</a></li>"

}
}
else
alert("Error fetching feeds!")
}
        
               
        function displayfeed1(result){
if (!result.error){


var thefeeds=result.feed.entries;
    stories = thefeeds;
    
for (var i=0; i<thefeeds.length-1; i++) {
  

   
    var urls = thefeeds[i].link.split("/");
 console.log(urls[4]);
 console.log(urls);
    
    var u = "";
    
    for (var p = 2; p<urls.length;p++) {
        u+=urls[p] + "/";
    }
    console.log(u);
    $.get( "../scrape2/" + encodeURIComponent(u) + "/" + i, function( data ) {
   
         stories[data.id].extraInfo = data; 
             console.log(data);
         console.log(stories[data.id]);
         console.log(stories[data.id].title);
        podcast.addCast(stories[data.id].title,stories[data.id].extraInfo.image,stories[data.id].extraInfo.article, stories[data.id].extraInfo.mp3);
   
    });
    
//rssoutput+="<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</a></li>"

}
} else {
alert("Error fetching feeds!")
}


        }

        
        
    
        
     




        


        function dist(x1, y1, x2, y2) {

            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);

            var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            return d;

        }
      
       
        
        
         function radians(degrees) {
            return degrees * Math.PI / 180;
        };

        function degrees(radians) {
            return radians * 180 / Math.PI;
        };
    
        
        
        function lerp(a, b, t) {
            var x = a + t * (b - a);
            return x;
        }


function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

      