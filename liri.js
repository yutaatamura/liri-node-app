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

//-------------------------------------------------------------------------
//Functions
//Twitter function
function tweet() {

    fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});


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

        var twitterResults = 
        
        "@"+ tweets[i].user.screen_name + ": " + tweets[i].text + "\r\n" + "Created: " + date.substring(0, 19) + "\r\n" +
        "------------" + (i+1) + "---------------" + "\r\n";

        console.log(twitterResults);
    }
    } else {
       console.log("Error: " + error);
       return; 
    }
    });
    liriArg = '';
}

//Spotify function 
function spotify(songName) {
    var songName = liriArg;
    
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (!err) {
          
            var songData = data.tracks.items;
            // console.log(JSON.stringify(songData[0], null, 2));
            for(var i=0; i<5; i++) {
                if (songData[i] != undefined) {
                    // console.log(JSON.stringify(data.tracks.items, null, 2));

                    var spotifyResults = 
                    "Artist: " + songData[i].artists[0].name + "\r\n" +

                    "Song: " + songData[i].name + "\r\n" +

                    "Preview URL: " + songData[i].preview_url + "\r\n" +

                    "Album: " + songData[i].album.name + "\r\n" +
        "---------------------" + (i+1) + "---------------------" + "\r\n";
                    console.log(spotifyResults);
                }
            }
            
        }
        else {
            console.log('Error occurred: ' + err);
            return;
          } 
       
       
      });
      liriArg = '';
}


if (liriCmd === 'my-tweets') {
    tweet();
} else if (liriCmd === 'spotify-this-song') {
    spotify();
}