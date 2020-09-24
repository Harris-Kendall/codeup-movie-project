const THEMOVIEDB_API_TOKEN = "67b9c6b38ecdf29bee715b3e3eef0d84"

const harkenDatabase = "https://enshrined-icy-harpymimus.glitch.me/movies"

let harkenMovies = () =>fetch(harkenDatabase)
    .then(response => response.json())
    .then(movies => {
        console.dir(movies)
        for(let movie of movies){
            let {title, rating} = movie;

            $('#main').append(`<img src=${getPoster(movie.title)} alt="movie poster"><p>${title} Rating: ${rating}</p>`);
        }
    })
    .catch(error => console.error(error))

harkenMovies();

function getPoster(title) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${THEMOVIEDB_API_TOKEN}&query=${title}`)
        .then(response => response.json())
        .then(movie =>{
            console.dir(movie.results[0])
            let currentMovie = movie.results[0]
            console.log(currentMovie.poster_path)
            let posterSource = `http://image.tmdb.org/t/p/w500/${currentMovie.poster_path}`
            console.log(typeof posterSource)
            // $('#main').append(`<img src=${posterSource} alt="movie poster">`);
        })
        .catch(error => console.error(error))
}
