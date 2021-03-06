require("dotenv").config();

// var spotify = new Spotify(keys.spotify);


var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var request = require('request');

var arg = process.argv;

var liriCmd = arg[2];

var liriArg = '';
for (var i=3; i<arg.length; i++) {
    liriArg += arg[i] + ' ';
}

controller(liriCmd, liriArg);

//-------------------------------------------------------------------------
//Functions

function controller(liriCmd, liriArg) {
    switch (liriCmd) {
        case "my-tweets":
        tweet();
        break;

        case "spotify-this-song":
        spotify();
        break;

        case "movie-this":
        movie();
        break;

        case "do-what-it-says":
        doWhatItSays();
        break;
    }
}

//OMDB Function 
function movie() {

    var movieTitle = liriArg;
    if (!movieTitle) {
        movieTitle = "Mr. Nobody";
    }

    request("http://www.omdbapi.com/?t=" + movieTitle + "&type=movie&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if(!error && response.statusCode === 200) {
            var movObj = JSON.parse(body);
            // console.log(movObj);
            var rottenTomReviews = '';
            if (movObj.Ratings[1] == undefined) {
                rottenTomReviews = "N/A"
                
            } else {
                rottenTomReviews = movObj.Ratings[1].Value;
            }

var movieResults =`
Title:   ${movObj.Title}   
Year:   ${movObj.Year}   
IMDB Rating:   ${movObj.Ratings[0].Value}   
Rotten Tomatoes Rating: `+rottenTomReviews+`   
Country:   ${movObj.Country}   
Language:   ${movObj.Language}   
Plot:   ${movObj.Plot}   
Actors:   ${movObj.Actors}   
-----------------------------------------  
`

            console.log(movieResults);
            log(movieResults);
            liriArg = '';
        }
    });


}


//Twitter function
function tweet() {

    var client = new Twitter(keys.twitter);
    var twitterUN = liriArg;
    if (!twitterUN) {
        twitterUN = "amidaseed";
    }
    var params = {screen_name: twitterUN, count: 20};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
    // console.log(tweets);

    for (var i=0; i<tweets.length; i++) {
        var date = tweets[i].created_at;

var twitterResults = `        
@${tweets[i].user.screen_name}: ${tweets[i].text} 
Created: ${date.substring(0, 19)}
------------ `+(i+1)+` ---------------
`

        console.log(twitterResults);
        log(twitterResults);
    }
    } else {
       console.log("Error: " + error);
        log(error);
       return; 
    }
    });
    liriArg = '';
}

//Spotify function 
function spotify(songName) {
    var songName = liriArg;

    if (!songName) {
        songName = "The Sign Ace of Base"
    };
    
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (!err) {
          
            var songData = data.tracks.items;
            // console.log(JSON.stringify(songData[0], null, 2));
            for(var i=0; i<1; i++) {
                if (songData[i] != undefined) {
                    // console.log(JSON.stringify(data.tracks.items, null, 2));

var spotifyResults = `
Artist:  ${songData[i].artists[0].name}   
Song:  ${songData[i].name}   
Preview URL:  ${songData[i].preview_url}   
Album:  ${songData[i].album.name}   
------------------------------------------` 

                    console.log(spotifyResults);
                    log(spotifyResults);
                }
            }
            
        }
        else {
            console.log('Error occurred: ' + err);
            log(err);
            return;
          } 
       
       
      });
      liriArg = '';
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) {

            // console.log(data.split(','));
            var dataArray = data.split(',');
            var randomCmd = dataArray[0];
            var randomArg = dataArray[1];

           controller(randomCmd, randomArg);

        } else {
            console.log("Error: " + error);
            log(error);
            return;
        }

    })


}

function log(results) {
    fs.appendFile("log.txt", results, function(err) {

        if (err) {
           console.log(err);
           return;
        }
    });
}


// if (liriCmd === 'my-tweets') {
//     tweet();
// } else if (liriCmd === 'spotify-this-song') {
//     spotify();
// } else if (liriCmd === 'movie-this') {
//     movie();
// } else if (liriCmd === 'do-what-it-says') {
//     doWhatItSays();
// }