/*
TODO
    ON PAGE LOAD:
    - display "loading..." message
    - make AJAX request to get a listing of all movies
    - remove the "loading..." message & replace with HTML generated from the json response
    ADD NEW MOVIES:
    - create a form for adding a new movie {name, title, rating}
    - When the form is submitted, the page should not reload / refresh, instead, your javascript
      should make a POST request to /movies with the information the user put into the form
    EDIT MOVIES:
    - Give users the option to edit an existing movie
    - A form should be pre-populated with the selected movie's details
    - Like creating a movie, this should not involve any page reloads, instead your javascript code
      should make an ajax request when the form is submitted.
    DELETE MOVIES:
    - Each movie should have a "delete" button
    - When this button is clicked, your javascript should send a DELETE request
    BONUSES:
    - Add a disabled attribute to buttons while their corresponding ajax request is still pending.
    - Show a loading animation instead of just text that says "loading...".
    - Use modals for the creating and editing movie forms.
    - Add a genre property to every movie.
    - Allow users to sort the movies by rating, title, or genre (if you have it).
    - Allow users to search through the movies by rating, title, or genre (if you have it).
    - Use a free movie API like OMDB to include extra info or render movie posters.
 */
//http://img.omdbapi.com/?apikey=30f046b7&t=Highlander
{
    /* Page Load: */
    //const OMDb_API_Key = '30f046b7'
    const ourURL = 'https://enshrined-icy-harpymimus.glitch.me/movies'
    const getMovies = () => fetch(ourURL)
        .then(res => res.json())
        .then(movies => {
            for (let movie of movies) {
                const imgSource = `https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${movie.title}&callback=?`
                $('#nav-home').append(`
                    <div class="card" style="width: 18rem;">
                      <img id="poster" src="${imgSource}" class="card-img-top" alt="movie poster">
                      <div class="card-body">
                        <h3>${movie.title}</h3>
                        <div class="stars-outer">
                            <div class="stars-inner"></div>
                        </div>
                      </div>
                    </div>
<!--                    <button id="edit-movie" class="btn btn-sm btn-primary">Edit Movie</button>-->
                `)
            }
        })
        .catch(console.error);

    //Wait for window load
    $(window).on('load', function() {
        //Animate loader off screen
        $(".se-pre-con").fadeOut("slow");
        getMovies();
    });

}
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
                $('#poster').html('<p>Your search found: <strong>' + json.results[0].title + '</strong></p><img src=\"http://image.tmdb.org/t/p/w500/' + json.results[0].poster_path + '\" class=\"img-responsive\" >');
            } else {
                $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=goonies&callback=?", function(json) {

                    console.log(json);
                    $('#poster').html('<div class="alert"><p>We\'re afraid nothing was found for that search.</p></div><p>Perhaps you were looking for The Goonies?</p><img id="thePoster" src="http://image.tmdb.org/t/p/w500/' + json[0].poster_path + ' class="img-responsive" />');
                });
            }
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