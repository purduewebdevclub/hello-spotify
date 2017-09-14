if(!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition");
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.onstart = function() {
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
    }
    recognition.onerror = function(event) {
    }
    var searchResults = document.getElementsByClassName('search_results')[0];
    function removeChildNodes(el) {
        while(el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
    recognition.onend = function() {
        if(final_transcript.toLowerCase().indexOf('search') > -1) {
            if(final_transcript.toLowerCase().indexOf('for the artist') > -1) {
                let index = final_transcript.toLowerCase().indexOf('artist');
                let artist = final_transcript.substr(index + 7);
                fetch(`http://localhost:3000/search/artist/${artist}`).then(r => r.json()).then(data => {
                    removeChildNodes(searchResults);
                    for(var i = 0; i < data.items.length; i++) {
                        var div = document.createElement('div');
                        div.className += 'card ';
                        div.className += 'col-md-3';
                        var parentDiv = div.appendChild(document.createElement('div'));
                        parentDiv.className += 'card-block';
                        var artist = data.items[i];
                        var header = parentDiv.appendChild(document.createElement('h3'));
                        header.innerHTML = artist.name;
                        header.className += 'card-title';
                        var image = artist.images[0];
                        if(image) {
                            var artistImage = div.appendChild(document.createElement('img'));
                            artistImage.className += 'card-img-top ';
                            artistImage.className += 'center-block';
                            artistImage.style.width = '75%';
                            artistImage.src = artist.images[0].url;
                        }
                        searchResults.appendChild(div);
                    }
                });
            } else if(final_transcript.toLowerCase().indexOf('for song') > -1) {
                let index = final_transcript.toLowerCase().indexOf('song');
                let song = final_transcript.substr(index + 5);
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