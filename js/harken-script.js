{
    // const $ = require('jquery');
    const THEMOVIEDB_API_TOKEN = "67b9c6b38ecdf29bee715b3e3eef0d84"

    const harkenDatabase = "https://enshrined-icy-harpymimus.glitch.me/movies"
    $(document).ready(() => {
        //--- Content for Main tab
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

        function harkenMovies() {
            fetch(harkenDatabase)
                .then(response => response.json())
                .then(movies => {
                    let promises = [];
                    for (let movie of movies) {
                        let {title, rating, id} = movie;
                        $('#main').append(`
                            <div id="${id}" class="card my-2" style="width: 18rem;">
                                <img class="card-img-top" data- src="" alt="movie poster">
                                <div class="card-body">
                                    <h3>${title}</h3> 
                                    <p>  ${rating} <i class="fas fa-star"></i></p>
                                    <div class="d-flex justify-content-around">
                                        <button data-movieid="${id}" class="edit btn btn-dark">Edit</button>
                                        <button data-movieid="${id}" class="deletion btn btn-dark">Delete</button>
                                    </div>
                                </div>
                            </div>
                        `);
                        promises.push(getPoster(title))
                    }
                    Promise.all(promises)
                        .then(function (movieUrls) {
                            let images = $('img');
                            for (let i = 0; i < movieUrls.length; i++) {
                                images[i].src = movieUrls[i];
                            }
                        })
                        .then(gatherEditDeleteButtons())
                })

                .catch(error => console.error(error))
        }

        //Initial call to populate Main tab
        harkenMovies();

        //---- Add a Movie Tab
        let getSearchPoster = function () {
            let film = $('#term').val();
            // Check for blank entry
            if (film === '') {
                $('#poster').html('<div class="alert"><strong>Oops!</strong> Try adding something into the search field.</div>');
            } else {
                $('#poster').html('<div class="alert"><strong>Loading...</strong></div>');
                $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=" + film + "&callback=?",
                    function (json) {
                    //Found Title
                    if (json !== "Nothing found.") {
                        //console.log(json);
                        //Show user result
                        $('#poster').html('<div class="card-body"><p class="text-white">You have added: <strong>' + json.results[0].title +
                            '</strong></p></div><div class="card" style="width: 18rem;"><img class="card-img-top" src=\"http://image.tmdb.org/t/p/w500/'
                            + json.results[0].poster_path + '\" class=\"img-responsive\" alt="movie poster"></div>');
                    //Show alternate response when title not found
                    } else {
                        $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=goonies&callback=?",
                            function (json) {
                            //console.log(json);
                            $('#poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div>' +
                                '<p>Perhaps you were looking for The Goonies?</p><img alt="movie poster" id="thePoster" src=\"http://image.tmdb.org/t/p/'
                                + json.results[0].poster_path + '\" class="img-responsive">');
                        });
                    }

                    let newMovie = {
                        title: json.results[0].title,
                        rating: document.getElementById('rate').value
                    }

                    function addMovie(newMovie) {
                        return fetch(harkenDatabase, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(newMovie)
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log("Success!")
                                return data;
                            })
                            .catch(console.error);
                    }

                    addMovie(newMovie).then(() => {
                            return fetch(harkenDatabase)
                                .then(response => response.json())
                                .then(console.log)
                                .then ($('#main').empty())
                                .then (harkenMovies())
                                .catch(console.error);
                    })
                });
            }
            return false;
        }

        $('#search').click(function(){
            getSearchPoster()
        });
        $('#term').keyup(function (event) {
            if (event.keyCode === 13) {
                getSearchPoster();
            }
        });// --- End of Add a Movie tab

        //----Edit Movie
        function editMovie(movieIdNumber, newTitle, newRating){
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"title": newTitle,"rating": newRating,"id": movieIdNumber});
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            let targetUrl = harkenDatabase + '/' + movieIdNumber;
            return fetch(targetUrl, requestOptions)
            // console.log(targetUrl, requestOptions)
        }

        //----Delete Movie
        function deleteMovie(movieIdNumber){
             const requestOptions ={
                 method: 'DELETE',
                 redirect: 'follow'
             };
             let targetUrl = harkenDatabase + '/' + movieIdNumber;
             console.log(targetUrl)
             return fetch(targetUrl, requestOptions)
        }

        //---- Gather all of the Edit and Delete buttons
        function gatherEditDeleteButtons(){
           const editButtons = document.querySelectorAll(".edit");
           const deleteButtons = document.querySelectorAll(".deletion")

           // Add listeners to the selected buttons
           editButtons.forEach((editButton, key) =>{
               editButton.addEventListener("click", (e) => {
                   let selectedMovie = e.target.dataset['movieid'];
                   // console.log(selectedMovie);
                   let modal = document.getElementById("myModal");
                   modal.style.display = "block";

                   let newTitle = '';
                   let newRating;
                   //---- Get newTitle and newRating from Modal window
                   $('#submit').click(function (){
                       if ($('#new-movie-title').val() == '') {
                           alert('Movie title cannot be left blank.')
                       } else newTitle = $('#new-movie-title').val()
                       newRating = $('#new-rating').val()
                       console.log(newTitle, newRating, selectedMovie)
                       modal.style.display = "none"
                       return editMovie(selectedMovie, newTitle, newRating)
                   })

                   // editMovie(selectedMovie, newTitle, newRating)
                   //     .then(response => response.text())
                   //     .then(result => console.log(result))
                   //     .catch(error => console.log('error', error));
               })
           });



           //---- Close modal window if user clicks "cancel"
           $('#cancel').on("click", (e) => {
               let modal = document.getElementById("myModal");
               modal.style.display = "none";
           })

           deleteButtons.forEach((deleteButton, key) =>{
               deleteButton.addEventListener("click", (e)=>{
                   let selectedMovie = e.target.dataset['movieid'];

                   deleteMovie(selectedMovie)
                       .then(response => response.json())
                       .then(console.log)
                       .then ($('#main').empty())
                       .then (harkenMovies())
                       .catch(console.error);
               })
           });

        }

        //---- Loading Animation
        $(window).on('load', function () {
            //Animate loader off screen
            $(".se-pre-con").fadeOut("slow");
        });

    });
}










