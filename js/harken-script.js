{
    // const $ = require('jquery');

$(document).ready(() => {

        const THEMOVIEDB_API_TOKEN = "67b9c6b38ecdf29bee715b3e3eef0d84"

        const harkenDatabase = "https://enshrined-icy-harpymimus.glitch.me/movies"

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
                        $('#main').append(`<img data-id="${movie.id}" src="" alt="movie poster"><p>${title} Rating: ${rating}</p>`);
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
    });
}