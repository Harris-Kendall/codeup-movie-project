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
const ourURL = 'https://enshrined-icy-harpymimus.glitch.me/movies'

const getMovies = () => fetch(ourURL)
    .then(res => res.json())
    .catch(console.error);
