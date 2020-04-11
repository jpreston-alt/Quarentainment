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
      var listName = response.results[i].display_name;
      var listItem = $("<li>").text(listName);
      $("#bookLists").append(listItem);
    }

    var listSelection = "hardcover-political-books";

    $("#bookLists").click(function () {
      var nytBookTitlesUrl =
        nytBooksUrl +
        "/lists/current/" +
        listSelection +
        "?api-key=" +
        nytApiKey;
      $.ajax({
        url: nytBookTitlesUrl,
        method: "GET",
      }).then(function (bookResponse) {
        console.log(bookResponse.results.books.length);
        for (j = 0; j < bookResponse.results.books.length; j++) {
          console.log(j);
          var bookName = bookResponse.results.books[j].title;
          console.log(bookName);
          var bookItem = $("<li>").text(bookName);
          $("#bookTitles").append(bookItem);
        }
      });
    });
  });

  var nytMovies = "https://api.nytimes.com/svc/movies/v2";
});
