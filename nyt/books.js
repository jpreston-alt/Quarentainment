$(document).ready(function () {
  var tmdbApiKey = "53fb3173ef10002db2f58ad55ccf032e";
  var tmdbQueryUrl =
    "https://api.themoviedb.org/3/movie/550?api_key=" + tmdbApiKey;

  var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
  var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
  var nytBookListsUrl = nytBooksUrl + "/lists/names.json?api-key=" + nytApiKey;

  $.ajax({
    url: nytBookListsUrl,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < response.results.length; i++) {
      var listYear = parseInt(
        response.results[i].newest_published_date.substring(0, 4)
      );
      if (listYear >= 2019) {
        var listName = response.results[i].display_name;
        var listItem = $("<li>").text(listName);
        $("#bookLists").append(listItem);
      }
    }

    var listSelection = "hardcover-fiction";

    var nytBookTitlesUrl =
      nytBooksUrl + "/lists/current/" + listSelection + "?api-key=" + nytApiKey;
    $.ajax({
      url: nytBookTitlesUrl,
      method: "GET",
    }).then(function (bookResponse) {
      console.log(bookResponse);
      for (j = 0; j < bookResponse.results.books.length; j++) {
        var bookDiv = $("<p>").html(
          bookResponse.results.books[j].title +
            "<br />" +
            bookResponse.results.books[j].contributor +
            "<br /><img src = '" +
            bookResponse.results.books[j].book_image +
            "'><br/><a href='" +
            bookResponse.results.books[j].amazon_product_url +
            "' target='_blank'>Buy It!</a><br/>" +
            bookResponse.results.books[j].description +
            "<br/>"
        );
        $("#bookCards").append(bookDiv);
      }
    });
  });

  var nytMovies = "https://api.nytimes.com/svc/movies/v2";
});
