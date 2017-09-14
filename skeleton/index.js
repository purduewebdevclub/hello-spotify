var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: 'edf9a5f7411c4c0ca3336a55838dbf0c',
    clientSecret: '7538f102cc9a4a4f9e6376a51e443d4c'
});

var listening = false;
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/www'));
var expires_in;
function diff_minutes(date1, date2) {
    var diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
function getCredentials() {
    return spotifyApi.clientCredentialsGrant().then(function(data) {
        originalDate = new Date();
        expires_in = data.body['expires_in'];
        spotifyApi.setAccessToken(data.body['access_token']);
        if(!listening) {
            app.listen(port);
            listening = true;
        }
    });
}
var tokenChecker = (req, res, next) => {
    if(diff_minutes(new Date(), originalDate) === expires_in) {
        getCredentials().then(() => next());
    } else {
        next();
    }
}
getCredentials();
app.get('/search/artist/:artistName', tokenChecker, (req, res) => {
    spotifyApi.searchArtists(req.params.artistName, {limit: 10 }, (err, data) => {
        if(err) {
            console.error('Something went wrong!');
        } else {
            console.log(data.body);
            res.send(data.body.artists);
        }
    });
});
app.get('/search/song/:songName', tokenChecker, (req, res) => {
    spotifyApi.searchTracks(req.params.songName, {limit: 10 }, (err, data) => {
        if(err) {
            console.error('Something went wrong!');
        } else {
            console.log(data.body);
            res.send(data.body.tracks);
        }
    });
});