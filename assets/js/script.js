var mediaType;
var genreList = [];
var cardsArr = [];
var listSelection;
var mediaTypeEl = $("#media-type");

function MediaCard(title, authorOrRating, imgURL, linkOrGenre, summary) {
    this.title = title;
    this.authorOrRating = authorOrRating;
    this.imgURL = imgURL;
    this.linkOrGenre = linkOrGenre;
    this.summary = summary;
};

var title;
var authorOrRating;
var imgURL;
var linkOrGenre;
var summary;

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
        })
    });

    // call event handlers for when user clicks on movies, books, or shows linkOrGenres
    clickMediaType("movies");
    clickMediaType("books");
    clickMediaType("shows");


    // event handler for when user changes genre on dropdown menu and clicks search button
    $("#dropdown-search-btn").on("click", function() {
       var genreSelection = ($("#dropdown-form").find("#media-dropdown").val());

        listSelection = genreSelection.replace(/\s+/g, '-');
        setStorage();

        if (mediaType === "books") {
            mediaTypeEl.text("Top Selling " + genreSelection);
            changeBookCards();
        } else if (mediaType === "movies") {
            changeMovieCards();
        } else if (mediaType === "shows") {
            changeTvShowCards();
        }
    });

});

// sets local storage
function setStorage() {

    // media type
    localStorage.setItem("mediaType", mediaType);
    localStorage.setItem("listSelection", listSelection);
};


// pulls from local storage
function getStorage() {
    mediaType = localStorage.getItem("mediaType");
    var storageList = localStorage.getItem("listSelection");

    // if list selection exists
    if (storageList !== null) {
        listSelection = storageList;
    };
};

// function for event handler when user clicks on media linkOrGenre
function clickMediaType(type) {
    $('.nav-to-' + type).on("click", function () {
        mediaType = type;
        setStorage();
        renderBrowsePage();
    });
};

// function for rendering dropdown menu based on genreList
function renderDropdown() {
    $("#media-dropdown").empty();

    for (var i = 0; i < genreList.length; i++) {
        var $newOption = $("<option>")
        $newOption.text(genreList[i]);
        $("#media-dropdown").append($newOption);
    };

};

function renderTrendingCards() {

    // create new card elements based on how many objects are in the cardsArray
    for (var i = 0; i < cardsArr.length; i++) {

        var mediaCardEl = $('<div class="column is-half"><div class= "card media-card"><div class="card-content columns is-mobile"><div class="column"><img src="' + cardsArr[i].imgURL + '" class="media-img"></div><div class="column is-scrollable"><p class="title media-title">' + cardsArr[i].title + '</p><p class="subtitle media-authorOrRating">' + cardsArr[i].authorOrRating + '</p><p>' + cardsArr[i].linkOrGenre + '</p><br><p class="subtitle media-summary">' + cardsArr[i].summary + '</p></div></div><footer class="card-footer"><a href="#" class="card-footer-item add-to-list-btn">Add to My List</a></footer></div></div >')

        // append new card element to content container
        $("#browse-content-container").append(mediaCardEl);
    };
};


// renders trending browse page depending on media type variable
function renderBrowsePage() {

    // empty cards container and cardsArr
    $("#browse-content-container").empty();
    cardsArr = [];

    if (mediaType === "books") {
        listSelection = "hardcover-fiction";
        mediaTypeEl.text("Top Selling Books of the Week")

        var nytApiKey = "GOOGHDHZGwdBBruE3XTXgj3TIcGoewXU";
        var nytBooksUrl = "https://api.nytimes.com/svc/books/v3";
        var nytBookListsUrl = nytBooksUrl + "/lists/names.json?api-key=" + nytApiKey;

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
            };

            renderDropdown();
        });

        changeBookCards();

    } else if (mediaType === "movies") {

        // change page title
        mediaTypeEl.text("Trending Movies of the Week")

        // render dropdown based on genres
        var genresArr = Object.values(genreDictionMovies);
        for (var i = 0; i < genresArr.length; i++) {
            genreList.push(genresArr[i]);
        };
        renderDropdown();

        // get trending movies data
        var trendURL = "https://api.themoviedb.org/3/trending/movie/day?api_key=660bf8330423e5658590b1cdb677dc08"

        $.ajax({
            url: trendURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            for (var i = 0; i < response.results.length; i++) {

                // convert genre id's to text
                var myGenreids = response.results[i].genre_ids;
                var anyString = ""
                for (var j = 0; j < myGenreids.length; j++) {
                    anyString = anyString + ", " + genreDictionMovies[myGenreids[j]]
                };

                var resString = anyString.substring(2);

                // save movie data to variables
                title = response.results[i].title;
                imgURL = "https://image.tmdb.org/t/p/w300/" + response.results[i].poster_path;
                authorOrRating =  response.results[i].vote_average
                linkOrGenre = resString;
                summary = response.results[i].overview;


                // create new MediaCard object with variables
                var card = new MediaCard(title, authorOrRating, imgURL, linkOrGenre, summary);

                // push new MediaCard to cardsArr
                cardsArr.push(card);
            };

            // render Trending cards to screen
            renderTrendingCards();
        });


    } else if (mediaType === "shows") {

        // call tv show data
        mediaTypeEl.text("Trending TV Shows of the Week")

        // render dropdown based on genres
        var genresArr = Object.values(genreDictionTV);
        for (var i = 0; i < genresArr.length; i++) {
            genreList.push(genresArr[i]);
        };
        renderDropdown();

        // get trending TV data
        var tQuery = "https://api.themoviedb.org/3/trending/tv/day?api_key=660bf8330423e5658590b1cdb677dc08"

        $.ajax({
            url: tQuery,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            for (var i = 0; i < response.results.length; i++) {

                var myGenreids = response.results[i].genre_ids;
                var anyString = ""
                for (var j = 0; j < myGenreids.length; j++) {
                    anyString = anyString + ", " + genreDictionTV[myGenreids[j]]
                }

                var resString = anyString.substring(2);

                
                title = response.results[i].original_name;
                imgURL = "https://image.tmdb.org/t/p/w300/" + response.results[i].poster_path;
                authorOrRating= response.results[i].vote_average + " out of 10";
                linkOrGenre = resString
                summary = response.results[i].overview;

                // create new MediaCard object with variables
                var card = new MediaCard(title, authorOrRating, imgURL, linkOrGenre, summary);

                // push new MediaCard to cardsArr
                cardsArr.push(card);

            };

            renderTrendingCards();
        });

    }
};

// change book cards when genre is switched from dropdown menu
function changeBookCards() {

    $("#browse-content-container").empty();
    cardsArr = [];

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
            linkOrGenre = '<a class="subtitle media-linkOrGenre" href="' + bookResponse.results.books[j].amazon_product_url + '">Purchase Here</a>'
            summary = bookResponse.results.books[j].description;

            // create new MediaCard object with variables
            var card = new MediaCard(title, authorOrRating, imgURL, linkOrGenre, summary);

            // push new MediaCard to cardsArr
            cardsArr.push(card);
        }

        // render Trending cards to screen
        renderTrendingCards();
    });
};

// change movie cards when genre is switched from dropdown menu
function changeMovieCards() {
    console.log("changed movie genre");
};


// change tv show cards when genre is switched from dropdown menu
function changeTvShowCards() {
    console.log("changed tv show genre");
};






// define init function
function init() {
    getStorage();
    renderBrowsePage();
};

// call init
init();
