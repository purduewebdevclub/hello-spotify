if(!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition");
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.onstart = function() {
        console.log("started");
    }
    recognition.onresult = function(event) {
        var interim_transcript = '';
        for(var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_span.innerHTML = final_transcript;
        interim_span.innerHTML = interim_transcript;
        console.log("Final", final_transcript);
        console.log("Interim", interim_transcript);
    }
    recognition.onerror = function(event) {
        console.log(event);
    }
    recognition.onend = function() {
        if(final_transcript.toLowerCase().indexOf('search') > -1) {
            if(final_transcript.toLowerCase().indexOf('for artist') > -1) {
                let index = final_transcript.toLowerCase().indexOf('artist');
                let artist = final_transcript.substr(index + 7);
                fetch(`http://localhost:3000/search/artist/${artist}`).then(r => r.json()).then(data => {
                    var artist = data.items[0];
                    console.log(artist);
                    var name_header = document.getElementById('artist_name');
                    name_header.innerHTML = artist.name;
                    var artist_image = document.getElementById('artist_image');
                    artist_image.src = artist.images[0].url;
                });
            } else if(final_transcript.toLowerCase().indexOf('for song') > -1) {
                let index = final_transcript.toLowerCase().indexOf('song');
                let song = final_transcript.substr(index + 5);
                console.log(song);
                fetch(`http://localhost:3000/search/song/${song}`).then(r => r.json()).then(data => {
                    console.log(data);
                });
            }
        }
    }

    function startButton(event) {
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
    }
    function stopButton(event) {
        recognition.stop();
    }
}