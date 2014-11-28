console.log("shitSticks");

var stories = [];
        var stories2  =  [];
   var interval;
var feedcontainer=document.getElementById("feed")
var feedurl="http://feeds.wnyc.org/radiolab?format=xml"
var feedlimit=10
var rssoutput="<h2>Latest NPR Business News:</h2><ul>";
    
var toucher, podcast, music;


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
            music = new player();
            
                rssfeedsetup();
                rssfeedsetup2();
            
            document.getElementById("podcasts").scrollIntoView();
            
            oldScroll = document.getElementById("contentContainer").scrollLeft; 
            console.log("estst");
            var hammertime = new Hammer(document.getElementById("contentContainer"), { direction: Hammer.DIRECTION_ALL, threshold: 200 });
                hammertime.on('pan', function(ev) {
                    toucher.swiped(ev);
                    });
          
            
            requestAnimationFrame(animate);
            
}

        function animate() {
            
            music.update();
            podcast.update();
            toucher.update();
            requestAnimationFrame(animate);
        }
        
     


    
    function podcasts() {
        
        this.casts = [];
        this.activeCast = -1;
        
        this.initOffset = document.getElementById("podcasts").childNodes[3].offsetTop + document.getElementById("podcasts").childNodes[5].offsetTop;
        
        this.lastClicked = 0;
        
        this.setDivs = function() {
            var cas = document.getElementsByClassName('podcastContainer');
            
            for (var i = 0; i<this.casts.length;i++) {
               //ss console.log(i);
                this.casts[i].ele = cas[i*2];
                this.casts[i].ele.childNodes[1].childNodes[4].childNodes[1].addEventListener("click", function(event) {
                    console.log(event.srcElement.getAttribute("number"));
                    var num = event.srcElement.getAttribute("number");
                    music.addToQueue(stories[num].mediaGroups[0].contents[0].url, podcast.casts[num].title, num);
                    
                });
            }
            
        }
        
        
        this.update = function() {
            
         if (toucher.state == 1) {
             var oldCast = this.activeCast;
                var scroll = document.getElementById("podcasts").scrollTop;
            // console.log(scroll);
            for (var i = 0; i<this.casts.length-1; i++) {
               if (this.casts[i].ele.offsetTop < scroll + .45*window.innerHeight) {
                 //  console.log(scroll - this.casts[i].ele.offsetTop);
                 //  console.log(scroll - this.casts[i].ele.offsetTop);
                   this.activeCast = i; 
               }
            
            }
             if (this.activeCast != oldCast) {
             var bI = document.getElementById("backgroundImage")
           
                 bI.childNodes[1].src = this.casts[this.activeCast].image;
                 
             }
             
             
             
         }
            
        }
        
        this.addCast = function(title, image,  excerpt, mp3) {
            
         this.casts[this.casts.length] = [];   
            var theCastNum = this.casts.length - 1;
         this.casts[theCastNum].title = title;   
         this.casts[theCastNum].image = image;
         this.casts[theCastNum].excerpt = excerpt;
            console.log(mp3);
         this.casts[theCastNum].mp3 = mp3;
            
            this.casts[theCastNum].ele = "";
            
         this.casts[theCastNum].canvas = document.createElement('canvas');
           this.casts[theCastNum].canvas.width = window.innerWidth;
        this.casts[theCastNum].canvas.height = window.innerHeight;
        this.casts[theCastNum].context = this.casts[theCastNum].canvas.getContext('2d');
            
            
         this.casts[theCastNum].html = "<div class='podcastContainer'><h4>" + title + "</h4>";   
         this.casts[theCastNum].html += "<div class='podcastContainer'><p class='excerpt' number='" + (theCastNum) + "'></p>";
         this.casts[theCastNum].html += "<a href='#' class='readMore'>Read More</a><div class='socialContainer fbContainer'><img src='images/social.svg'></div><div class='socialContainer twitterContainer'><img src='images/social.svg'></div><div class='podcastImage' style='background: url(" + image + ") no-repeat center center fixed; webkit-background-size: cover; background-size: cover;'>";
         this.casts[theCastNum].html += "<img class='playButton'  number='" + theCastNum + "' src='images/play.svg'><img sclass='addToPlaylist' number='" + theCastNum + "' src='images/addToPlayList.svg'></div></div></div>";
            
        document.getElementById("podcasts").innerHTML  += this.casts[this.casts.length-1].html;
         
            this.casts[theCastNum].img = new Image();
            
            this.casts[theCastNum].loaded = function(whichOne) {
              podcast.casts[whichOne].context.drawImage(podcast.casts[whichOne].img,0,0);  
                console.log(podcast.casts[whichOne].img);
                
            }
            
            this.casts[theCastNum].img.onload = this.casts[theCastNum].loaded(theCastNum);
            
            this.casts[theCastNum].img.src=image;
            
            
            
            var eles = document.getElementsByClassName('excerpt');
            var casts = document.getElementsByClassName('podcastContainer');
            var imgs = document.getElementsByClassName("podcastImage");
            
           
            for (var i = 0; i <eles.length;i++) {
               // this.casts[i].element = casts[i];
             if (eles[i].getAttribute("number")==(theCastNum)) {
                 imgs[i].style.backgroundImage = "url(" + image + ") no-repeat center center fixed"
                 eles[i].textContent=strip(this.casts[theCastNum].excerpt).substring(0, 230) + "...";
                
                 
             }
                
                
            }
            
            
            
            
          this.setDivs();  
            
            
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
                    header.style.webkitTransform = "translate(" + (window.innerWidth - 21) + "px, -7px)";
                    //console.log("translate(" + this.headPos + ", -7px)")
                    
                    break;
             case 1:
                        conCon.scrollLeft=lerp(conCon.scrollLeft,window.innerWidth,.25);    
            
                    header.style.transform = "translate(" + 0 + "px, -7px)";
                    header.style.webkitTransform = "translate(" + 0 + "px, -7px)";
                   // console.log("translate(" + this.headPos + ", -7px)")
                    break;
                    
            case 2:
                    var about = document.getElementById("about");
      conCon.scrollLeft=lerp(conCon.scrollLeft,window.innerWidth*2,.25);               
                

                     
                    header.style.transform = "translate(" + (-window.innerWidth + 21) + "px, -7px)";
                    header.style.webkitTransform = "translate(" + (-window.innerWidth + 21) + "px, -7px)";
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

        
function player() {
    console.log("clicked");
 this.ele = document.getElementById("musicPlayer");
 this.player = document.getElementById("player");
 this.queue = document.getElementById("queue");
 this.ul = document.getElementById("queueList");
this.playhead = document.getElementById('playhead');
this.timeline = document.getElementById('timeline');
    
    this.audio = document.getElementById('music');
    
    this.aleOpac = false;
    this.aleO = 1;
    this.list = [];
    
    this.open = false;
    this.ale = "";
    
    
    this.currentlyPlaying = -1;
    
    
    
    
    
    document.getElementById('pButton').addEventListener("click",  function() {
       
        music.audio.play();
        
    });
    
    document.getElementById('pauseButton').addEventListener("click",  function() {
       
        music.audio.pause();
        
    });
    
    
    this.clickIt = function() {
        if (music.open==false) {
     console.log("clicked");
        console.log(this.player);
        
        music.queue.style.transform = "translate3d(0,-170px,0)";
        music.queue.style.webkitTransform = "translate3d(0,-170px,0)";
        music.queue.style.backgroundColor = "rgba(0,0,0,.6)";
        
        music.player.style.transform = "translate3d(0,-170px,0)";
        music.player.style.webkitTransform = "translate3d(0,-170px,0)";
            
            music.open = true;
            
        } else {
        music.queue.style.height = "";
        music.queue.style.transform = "";
        music.queue.style.webkitTransform = "";
        music.queue.style.backgroundColor = "";
        
        music.player.style.transform = "";
        music.player.style.webkitTransform = "";
            music.open = false;
        }
        
    }
    
    
    this.update = function() {
        
        if (this.aleOpac) {
            this.aleO = lerp(this.aleO, 0, .004);
            this.ale.style.opacity = this.aleO;
            if (this.aleO<.8) {
               this.aleO = lerp(this.aleO, 0, .1); 
                this.ale.style.opacity = this.aleO;
                if(this.aleO<.05) {
                 this.aleOpac=false;
                  document.getElementById("container").removeChild(this.ale);
                    this.ale = "";
                }
                
            }
            
            
            
            
        }
    }
    
    
//    $("#musicPlayer").click(function() {
//        console.log("clicked");   
//        
//    });
    this.queue.childNodes[1].addEventListener("click", this.clickIt);
    
    
    this.playFromQueue = function(event) {
        console.log(event);
        
        var whichOne = event.srcElement.getAttribute("number");
        console.log(whichOne);
        
        
        if (this.currentlyPlaying!=whichOne) {
            
            document.getElementsByClassName("playingIt")[0].className=""
            var lists = this.ul.getElementsByTagName('li');
            console.log(lists);
            for (var i = 0; i<lists.length;i++) {
             if (lists[i].getAttribute("number") == whichOne) {
              lists[i].className = "playingIt";   
                 music.currentlyPlaying = whichOne;
                 music.audio.childNodes[1].src = podcast.casts[whichOne].mp3;
                 music.audio.load();
                 
                 music.audio.play();
                 music.audio.pause();
                 music.audio.play();
                
                 music.playIt();
             }
                
            }
            
        }
        
        event.preventDefault();
        
        
    }
    
    
    
    this.playIt = function() {
        console.log("plauit");
        document.getElementById("music").addEventListener("canplay", function() {
            
	music.duration = music.audio.duration;
            
             document.getElementById("music").addEventListener("timeupdate", music.timeUpdate, false);
            
}, false);
    
   
        music.timeline.addEventListener("click", function (event) {
	           music.moveplayhead(event);
	           music.audio.currentTime = music.audio.duration * music.clickPercent(event);
}, false);
        
        
        this.clickPercent = function(e) {
        console.log(e);
	return (e.pageX - music.timeline.offsetLeft) / music.timeline.clientWidth;
}
        
        
        this.moveplayhead = function(e) {
	var newMargLeft = e.pageX - music.timeline.offsetLeft;
        
	if (newMargLeft >= 0 && newMargLeft <= music.timeline.clientWidth) {
		music.playhead.style.marginLeft = newMargLeft + "px";
	}
	if (newMargLeft == 0) {
		music.playhead.style.marginLeft = "0px";
	}
	if (newMargLeft == music.timeline.clientWidth) {
		music.playhead.style.marginLeft = music.timeline.clientWidth + "px";
	}
}
        
    
    this.timeUpdate = function() {
     //console.log("update");
        var playPercent = 100 * (music.audio.currentTime / music.audio.duration);
//        console.log(playPercent);
        var time = music.audio.currentTime;
        var fullTime = music.audio.duration;
        
        var hours = Math.floor(time/(60*60));
        if (hours<10) {
         hours = "0" + hours;   
        }
        var minutes = Math.floor((time/60) - (hours*60));
        if (minutes<10) {
         minutes = "0" + minutes;   
        }
        var seconds = Math.floor(time - (hours*60*60) - (minutes*60));
        if (seconds<10) {
         seconds = "0" + seconds;   
        }
        
        var fullHours = Math.floor(fullTime/(60*60));
        var fullMinutes = Math.floor((fullTime/60) - (fullHours*60));
        var fullSeconds = Math.floor(fullTime - (fullHours*60*60) - (fullMinutes*60));
        
        if (fullHours<10) {
         fullHours = "0" + fullHours;   
        }
        if (fullMinutes<10) {
         fullMinutes = "0" + fullMinutes;   
        }
        if (fullSeconds<10) {
         fullSeconds = "0" + fullSeconds;   
        }
        
        
	   music.playhead.style.marginLeft = playPercent + "%";
        
//        console.log(fullHours);
        if (fullHours<1) {
         music.playhead.childNodes[1].innerHTML = minutes + ":" + seconds + "/" + fullMinutes + ":" + fullSeconds;   
        } else {
          music.playhead.childNodes[1].innerHTML = hours + ":" + minutes + ":" + seconds + "/" + fullHours + ":" + fullMinutes + ":" + fullSeconds;    
        }
        
        
    }
        
    }
    
    
    this.addToQueue = function(url,  title, number) {
        var play = false;
        if (this.list.length==0) {
            play = true;
            this.ul.innerHTML = "";
            
            
        } else {
            if (this.ale!="") {
         document.getElementById("container").removeChild(this.ale);   
        }
            
        }
        
        if (this.list.length>=1 && this.list[this.list.length-1].title == title) {
         //its already a part of the list 
            this.ale = document.createElement('div');
            this.ale.className = "button alert";
            this.ale.innerHTML = title + " was just added to your queue, we're leaving it alone ;)";
            this.aleOpac = true;
            this.aleO = 1;
            
            
            document.getElementById("container").appendChild(this.ale);
            
        } else {
        //add it to the list
        this.list.push({url: url, title: title,number: number});
            
            var li = document.createElement("li");
            li.setAttribute("number", number);
            if (play) {
             li.className = "playingIt";   
            }
            
            var a = document.createElement('a');
            a.href = number;
            a.setAttribute("url", url);
            a.innerHTML = title;
            
            
            var buttonLink = document.createElement('a');
            buttonLink.href=url;
            buttonLink.className="addFromPlaylist";
            buttonLink.setAttribute("number", number);
            var buttonIMG = document.createElement('img');
            buttonIMG.src="images/play.svg";
             buttonIMG.setAttribute("number", number);
            buttonLink.appendChild(buttonIMG);
            
            buttonLink.addEventListener("click", function(event) {
                
                music.playFromQueue(event);
            });
            
            li.appendChild(buttonLink);
            li.appendChild(a);
            
            
            this.ul.appendChild(li);
            
            
            this.ale = document.createElement('div');
            this.ale.className = "button alert";
            this.ale.innerHTML = title + " was added to your queue!";
            this.aleOpac = true;
            this.aleO = 1;
            
            
            document.getElementById("container").appendChild(this.ale);
            
            
            console.log(this.list);
        }
        };
    
    
    
}


        
        function displayfeed2(result){
if (!result.error){
var thefeeds=result.feed.entries;
    
for (var i=0; i<thefeeds.length-1; i++) {
  

   
    var urls = thefeeds[i].link.split("/");
// console.log(urls[4]);
   
    
    
    $.get( "../scrape/" + urls[4] + "/" + i, function( data ) {
//    console.log(data);
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
//         console.log(stories[data.id].title);
        podcast.addCast(stories[data.id].title,stories[data.id].extraInfo.image,stories[data.id].extraInfo.article, stories[data.id].mediaGroups[0].contents[0].url);
   
    });
    
//rssoutput+="<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</a></li>"

}
    
    podcast.setDivs();
    
    
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

      