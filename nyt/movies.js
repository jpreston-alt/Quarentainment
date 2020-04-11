$(document).ready(function () {
  var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
  var nytMoviesUrl = "https://api.nytimes.com/svc/movies/v2";
  var nytMovieListUrl =
    nytMoviesUrl + "/reviews/picks.json?api-key=" + nytApiKey;

  $.ajax({
    url: nytMovieListUrl,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < response.results.length; i++) {
      var divMovie = $("<p>").html(
        response.results[i].display_title +
          "<br />" +
          response.results[i].mpaa_rating +
          "<br /><img src= '" +
          response.results[i].multimedia.src +
          "'><br/><a href='" +
          response.results[i].link.url +
          "' target='_blank'>Read the Review</a><br/>" +
          response.results[i].summary_short +
          "<br/>"
      );
      $("#movieList").append(divMovie);
    }
  });

  function getReviewLink(title) {
    nytMovieSearchUrl =
      nytMoviesUrl +
      "/reviews/search.json?query=" +
      title +
      "&api-key=" +
      nytApiKey;
    $.ajax({
      url: nytMovieSearchUrl,
      method: "GET",
      // success: function (responseJSON) {
      //   console.log(responseJSON);
      //   return responseJSON;
      // },
    }).done(function (response) {
      var reviewLink = response.results[0].link.url;
      console.log(reviewLink);
      console.log(response);
      return response;
    });
  }

  console.log(getReviewLink("the lion king"));
  // console.log(getReviewLink("the lion king").responseJSON);
  // console.log(getReviewLink("the lion king").responseText);

  // var link = getReviewLink("the lion king").responseJSON.results[0].link.url;
  // console.log(link);
  // $("#searchResult").attr("href", link);
});
