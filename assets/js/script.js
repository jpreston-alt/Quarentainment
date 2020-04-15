var mediaType; // movies shows or books
var genreList = []; // for dropdown
var cardsArr = []; // holds MediaCard object instances
var listSelection; // genre to be searched for
var mediaTypeEl = $("#media-type");

// media card object constructor
function MediaCard(title, authorOrRating, imgURL, genre, summary, link) {
  this.title = title;
  this.authorOrRating = authorOrRating;
  this.imgURL = imgURL;
  this.genre = genre;
  this.summary = summary;
  this.link = link;
}

// movie genres
var genreDictionMovies = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// tv show genres
var genreDictionTV = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
  28: "Action",
  12: "Adventure",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
};

// event listeners
$(document).ready(function () {
  // event listener for hamburger drop down menu
  $(".navbar-burger").each(function () {
    $(this).on("click", function () {
      // targets data-target attribute which is equal to regular nav bar menu's ID
      var targetAttribute = $(this).attr("data-target");
      var $navbarMenuID = $("#" + targetAttribute);

      // toggles active class between regular navbar menu and hamburger menu
      $(this).toggleClass("is-active");
      $navbarMenuID.toggleClass("is-active");
    });
  });

  // event handlers for movies, books, and shows links (from navbar or home page)
  clickMediaType("movies");
  clickMediaType("books");
  clickMediaType("shows");

  // event handler for when user changes genre on dropdown menu and clicks search button
  $("#dropdown-search-btn").on("click", function () {
    var genreSelection = $("#dropdown-form").find("#media-dropdown").val();
    $("#browse-content-container").empty();
    cardsArr = [];

    if (genreSelection === "Trending") {
      renderTrendBrowsePage();
    } else if (genreSelection === "NYT Critics Picks") {
      nytCriticsPicks();
    } else {
      listSelection = genreSelection.replace(/\s+/g, "-");
      setStorage();

      if (mediaType === "books") {
        mediaTypeEl.text("Top Selling " + genreSelection);
        changeBookCards();
      } else if (mediaType === "movies") {
        mediaTypeEl.text("Trending Movies: " + genreSelection);
        changeMovieOrTVCards();
      } else if (mediaType === "shows") {
        mediaTypeEl.text("Trending TV Shows: " + genreSelection);
        changeMovieOrTVCards();
      }
    }
  });
});

// sets local storage
function setStorage() {
  localStorage.setItem("mediaType", mediaType);
  localStorage.setItem("listSelection", listSelection);
}

// pulls from local storage
function getStorage() {
  mediaType = localStorage.getItem("mediaType");
  var storageList = localStorage.getItem("listSelection");

  // if list selection exists
  if (storageList !== null) {
    listSelection = storageList;
  }
}

// function for event handler when user clicks on media genre
function clickMediaType(type) {
  console.log(type);
  $(".nav-to-" + type).on("click", function () {
    mediaType = type;
    setStorage();
    renderTrendBrowsePage();
  });
}

// function for rendering dropdown menu based on genreList
function renderDropdown() {
  $("#media-dropdown").empty();
  $("#media-dropdown").append($("<option>").text("Trending"));

  if (mediaType === "movies") {
    $("#media-dropdown").append($("<option>").text("NYT Critics Picks"));
  }

  for (var i = 0; i < genreList.length; i++) {
    var newOption = $("<option>");
    newOption.text(genreList[i]);
    $("#media-dropdown").append(newOption);
  }
}

function renderMediaCards() {
  // create new card elements based on how many objects are in the cardsArray
  for (var i = 0; i < cardsArr.length; i++) {
    var mediaCardEl = $(
      '<div class="column is-half"><div class= "card media-card"><div class="card-content columns is-mobile"><div class="column"><img src="' +
        cardsArr[i].imgURL +
        '" class="media-img"></div><div class="column has-text-centered"><p class="title is-4 media-title">' +
        cardsArr[i].title +
        '</p><p class="media-authorOrRating is-italic subtitle">' +
        cardsArr[i].authorOrRating +
        '</p><br><div class="is-scrollable"><p class="media-summary has-text-justified">' +
        cardsArr[i].summary +
        '</p><br><p class="media-genre">' +
        cardsArr[i].genre +
        '</p></div></div></div><div class="fixed-bottom"><footer class="card-footer"><p class="card-footer-item"><span><a href = "#"> Add to My List</a></span></p>' +
        cardsArr[i].link +
        "</footer></div></div></div >"
    );

    // append new card element to content container
    $("#browse-content-container").append(mediaCardEl);
  }
}

// renders trending browse page depending on media type variable
function renderTrendBrowsePage() {
  // empty cards container and cardsArr
  $("#browse-content-container").empty();
  cardsArr = [];

  if (mediaType === "books") {
    listSelection = "hardcover-fiction";
    mediaTypeEl.text("Top Selling Books this Week");

    // renders dropdown
    var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
    var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
    var nytBookListsUrl =
      nytBooksUrl + "/lists/names.json?api-key=" + nytApiKey;

    $.ajax({
      url: nytBookListsUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      for (i = 0; i < response.results.length; i++) {
        var listYear = parseInt(
          response.results[i].newest_published_date.substring(0, 4)
        );
        if (listYear >= 2019) {
          var listItem = response.results[i].list_name;
          genreList.push(listItem);
        }
      }
      renderDropdown();
    });

    changeBookCards();
  } else if (mediaType === "movies") {
    mediaTypeEl.text("Trending Movies this Week");
    renderTrendMovieOrTV("movie", genreDictionMovies);
  } else if (mediaType === "shows") {
    mediaTypeEl.text("Trending TV Shows this Week");
    renderTrendMovieOrTV("tv", genreDictionTV);
  }
}

var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
var nytMoviesUrl = "https://api.nytimes.com/svc/movies/v2";

function nytCriticsPicks() {
  mediaTypeEl.text("New York Times Critics' Picks");
  var nytMovieListUrl =
    nytMoviesUrl + "/reviews/picks.json?api-key=" + nytApiKey;

  $.ajax({
    url: nytMovieListUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    for (i = 0; i < response.results.length; i++) {
      title = response.results[i].display_title.toUpperCase();
      authorOrRating = response.results[i].mpaa_rating;
      imgURL = response.results[i].multimedia.src;
      genre = "";
      summary = response.results[i].summary_short;
      link =
        '<p class="card-footer-item"><a href = "' +
        response.results[i].link.url +
        '">Read NYT Review</a></p>';

      // create new MediaCard object with variables
      var card = new MediaCard(
        title,
        authorOrRating,
        imgURL,
        genre,
        summary,
        link
      );

      // push new MediaCards to cardsArr
      cardsArr.push(card);
    }

    renderMediaCards();
    console.log(response);
  });
}

function getNytReviewLink(title) {
  nytMovieSearchUrl =
    nytMoviesUrl +
    "/reviews/search.json?query=" +
    title +
    "&api-key=" +
    nytApiKey;

  $.ajax({
    url: nytMovieSearchUrl,
    method: "GET",
  }).then(function (data) {
    console.log(data.results[0].link.url);
    // return data.results[0].link.url;
  });
}

function renderTrendMovieOrTV(type, genreDictionType) {
  // render dropdown based on genres
  var genresArr = Object.values(genreDictionType);
  for (var i = 0; i < genresArr.length; i++) {
    genreList.push(genresArr[i]);
  }

  renderDropdown();

  // get trending data
  var trendURL =
    "https://api.themoviedb.org/3/trending/" +
    type +
    "/day?api_key=660bf8330423e5658590b1cdb677dc08";

  $.ajax({
    url: trendURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    for (var i = 0; i < response.results.length; i++) {
      // convert genre id's to text
      var myGenreids = response.results[i].genre_ids;
      var anyString = "";

      for (var j = 0; j < myGenreids.length; j++) {
        anyString = anyString + ", " + genreDictionType[myGenreids[j]];
      }

      var resString = anyString.substring(2);

      // save movie data to variables
      if (mediaType === "movies") {
        title = response.results[i].title.toUpperCase();
      } else {
        title = response.results[i].original_name.toUpperCase();
      }

      imgURL =
        "https://image.tmdb.org/t/p/w300/" + response.results[i].poster_path;
      authorOrRating = response.results[i].vote_average + " / 10";
      genre = resString;
      summary = response.results[i].overview;
      link = getNytReviewLink(title);

      // create new MediaCard object with variables
      var card = new MediaCard(
        title,
        authorOrRating,
        imgURL,
        genre,
        summary,
        link
      );

      // push new MediaCards to cardsArr
      cardsArr.push(card);
    }

    // render cards form cardsArr to screen
    renderMediaCards();
  });
}

// change book cards when genre is switched from dropdown menu
function changeBookCards() {
  // get data from NYT api
  var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
  var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
  var nytBookTitlesUrl =
    nytBooksUrl + "/lists/current/" + listSelection + "?api-key=" + nytApiKey;

  $.ajax({
    url: nytBookTitlesUrl,
    method: "GET",
  }).then(function (bookResponse) {
    for (j = 0; j < bookResponse.results.books.length; j++) {
      // save data to variables
      title = bookResponse.results.books[j].title;
      authorOrRating = bookResponse.results.books[j].contributor;
      imgURL = bookResponse.results.books[j].book_image;
      genre = "";
      summary = bookResponse.results.books[j].description;
      link =
        '<p class="card-footer-item"><a href = "' +
        bookResponse.results.books[j].amazon_product_url +
        '">Purchase</a></p>';

      // create new MediaCard object with variables
      var card = new MediaCard(
        title,
        authorOrRating,
        imgURL,
        genre,
        summary,
        link
      );

      // push new MediaCard to cardsArr
      cardsArr.push(card);
    }

    // render cards from cards array to screen
    renderMediaCards();
  });
}

// change movie cards when genre is switched from dropdown menu
function changeMovieOrTVCards(type) {
  console.log("changed movies or tv genre");

  // call data from TMDB to browse by genre
}

// define init function
function init() {
  getStorage();
  renderTrendBrowsePage();
}

// call init
init();
