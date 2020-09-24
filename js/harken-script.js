{
    // const $ = require('jquery');
    const THEMOVIEDB_API_TOKEN = "67b9c6b38ecdf29bee715b3e3eef0d84"

    const harkenDatabase = "https://enshrined-icy-harpymimus.glitch.me/movies"
$(document).ready(() => {

        function getPoster(title) {
            return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${THEMOVIEDB_API_TOKEN}&query=${title}`)
                .then(response => response.json())
                .then(movie => {
                    console.log(movie)
                    let posterPath = movie.results[0].poster_path
                    return "http://image.tmdb.org/t/p/w500" + posterPath
                })
                .catch(error => console.error(error))
        }

    let harkenMovies = () => {
            fetch(harkenDatabase)
                .then(response => response.json())
                .then(movies => {
                    let promises = [];
                    for (let movie of movies) {
                        let {title, rating} = movie;
                        $('#main').append(`
                            <div class="card my-2" style="width: 18rem;">
                                <img class="card-img-top" data-id="${movie.id}" src="" alt="movie poster">
                                <div class="card-body">
                                    <h3>${title}</h3> 
                                    <p>  ${rating} <i class="fas fa-star"></i></p>
                                    <div class="d-flex justify-content-around">
                                        <button id="${movie.id}" class="edit btn btn-dark">Edit</button>
                                        <button id="${movie.id}" class="deletion btn btn-dark">Delete</button>
                                    </div>
                                </div>
                            </div>
                            
                        `);
                        promises.push(getPoster(title))
                    }
                    Promise.all(promises)
                        .then(function(movieUrls){
                            let images = $('img');
                            for(let i = 0; i<movieUrls.length; i++){
                                images[i].src = movieUrls[i];
                            }
                        })
                })
                .catch(error => console.error(error))
        }

        harkenMovies();
    //Delete Movies button

    // $('.deletion').on("click", () =>
    //     fetch(`${harkenDatabase}/${movie.id}`, {
    //         method: 'DELETE',
    //         headers: {'Content-Type':'application/json'}
    //     }).then(res => res.json())
    //         .then(() =>
    //             console.log(`Success: deleted movie with id of ${movie.id}`))
    //         .catch(console.error);
    // });

    //Edit Movie button

    // Add Movie


    //Window load spinner...
    $(window).on('load', function() {
        //Animate loader off screen
        $(".se-pre-con").fadeOut("slow");
    });
});


    //Movie search tab
    $('#term').focus(function(){
        var full = $("#poster").has("img").length ? true : false;
        if(full == false){
            $('#poster').empty();
        }
    });

    var getPoster = function(){

        var film = $('#term').val();

        if(film == ''){

            $('#poster').html('<div class="alert"><strong>Oops!</strong> Try adding something into the search field.</div>');

        } else {

            $('#poster').html('<div class="alert"><strong>Loading...</strong></div>');

            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?", function(json) {
                if (json != "Nothing found."){
                    console.log(json);
                    $('#poster').html('<div class="card-body"><p class="text-white">You have added: <strong>' + json.results[0].title + '</strong></p></div><div class="card" style="width: 18rem;"><img class="card-img-top" src=\"http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '\" class=\"img-responsive\" ></div>');
                } else {
                    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=goonies&callback=?", function(json) {

                        console.log(json);
                        $('#poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><p>Perhaps you were looking for The Goonies?</p><img id="thePoster" src="http://image.tmdb.org/t/p/' + json[0].poster_path + ' class="img-responsive" />');
                    });
                }
                let newMovie = {
                    title: json.results[0].title,
                    rating: document.getElementById('rate').value
                }
                function addMovie (newMovie) {
                    return fetch(harkenDatabase, {
                        method: "POST",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify(newMovie)
                    })
                        .then(response => response.json())
                        .then(data => console.log('success'))
                        .catch(console.error);
                }
                console.log(addMovie(newMovie));
            });

        }

        return false;
    }


    $('#search').click(getPoster);
    $('#term').keyup(function(event){
        if(event.keyCode == 13){
            getPoster();
        }
    });

}









