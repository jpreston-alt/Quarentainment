$(document).ready(function () {
  var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
  var nytMoviesUrl = "https://api.nytimes.com/svc/movies/v2";
  var nytMovieListUrl =
    nytMoviesUrl + "/reviews/picks.json?api-key=" + nytApiKey;

  $.ajax({
    url: nytMovieListUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    for (i = 0; i < response.results.length; i++) {
      var divMovie = $("<p>").html(
        response.results[i].display_title +
          "<br />" +
          response.results[i].mpaa_rating +
          "<br /><img src = '" +
          response.results[i].multimedia.src +
          "'><br/><a href='" +
          response.results[i].link.url +
          "'>Read the Review</a><br/>" +
          response.results[i].summary_short +
          "<br/>"
      );
      $("#movieList").append(divMovie);
    }
  });
});
