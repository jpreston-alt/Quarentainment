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
      var title = response.results[i].display_title;

      var divMovie = $("<p>").html(
        title +
          "<br />" +
          response.results[i].mpaa_rating +
          "<br /><img src= '" +
          response.results[i].multimedia.src +
          "'><br/><a href='" +
          response.results[i].link.url +
          // resultLink +
          "' target='_blank'>Read the Review</a><br/>" +
          response.results[i].summary_short +
          "<br/>"
      );

      $("#movieList").append(divMovie);
      // });
    }
  });

  function getReviewLink(title, id) {
    nytMovieSearchUrl =
      nytMoviesUrl +
      "/reviews/search.json?query=" +
      title +
      "&api-key=" +
      nytApiKey;

    results = $.Deferred();

    $.ajax({
      url: nytMovieSearchUrl,
      method: "GET",
      dataType: "json",
    }).done(function (data) {
      // results.resolve(data);
      useReviewLink(data, id);
    });
    return results.promise();
  }

  // console.log(
  //   $.when(getReviewLink("the lion king", "searchResult")).then(function (value) {
  //     console.log(value);
  //     return value;
  //   })
  // );
  $.when(getReviewLink("the lion king")).then(
    useReviewLink(response, "searchResult")
  );

  function useReviewLink(data, id) {
    var link = data.results[0].link.url;
    console.log(link);
    $("#" + id).attr("href", link);
  }
});
