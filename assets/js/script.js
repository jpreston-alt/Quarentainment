var mediaType;
var genreList = [];
var cardsArr = [];

function MediaCard(title, author, imgURL, link, summary) {
    this.title = title;
    this.author = author;
    this.imgURL = imgURL;
    this.link = link;
    this.summary = summary;
};

var title;
var author;
var imgURL;
var link;
var summary;


$(document).ready(function () {

    // event listener for hamburger menu - when user clicks it it drops down and vice versa
    var $navbarBurgers = $(".navbar-burger")

    $navbarBurgers.each(function () {
        $(this).on("click", function () {

            // targets data-target attribute which is equal to regular nav bar menu's ID
            var targetAttribute = $(this).attr("data-target");
            var $navbarMenuID = $("#" + targetAttribute);

            // toggles active class between regular navbar menu and hamburger menu
            $(this).toggleClass("is-active");
            $navbarMenuID.toggleClass("is-active");
        })
    });

    // call event handlers for when user clicks on movies, books, or shows links
    clickMediaType("movies");
    clickMediaType("books");
    clickMediaType("shows");
});

// sets local storage
function setStorage() {

    // media type
    localStorage.setItem("mediaType", mediaType);
};


// pulls from local storage
function getStorage() {

    // saves media type to variable
    mediaType = localStorage.getItem("mediaType");
};

// function for event handler when user clicks on media link
function clickMediaType(type) {
    $('.nav-to-' + type).on("click", function (event) {

        // only if you're own the browse page preventDefault
        // if ($("body").is(".browse-page")) {
        //     event.preventDefault();
        // };

        // empty content container and cards array of any cards
        $("#browse-content-container").empty();
        cardsArr = [];

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

        var mediaCardEl = $('<div class="column is-half"><div class= "card"><div class="card-content columns is-mobile"><div class="column"><img src="' + cardsArr[i].imgURL + '" class="media-img"></div><div class="column"><p class="title media-title">' + cardsArr[i].title + '</p><p class="subtitle media-author">' + cardsArr[i].author + '</p><a class="subtitle media-link" href="' + cardsArr[i].link + '">Purchase Here</a><p class="subtitle media-summary">' + cardsArr[i].summary + '</p></div></div><footer class="card-footer"><a href="#" class="card-footer-item add-to-list-btn">Add to My List</a></footer></div></div >')

        // append new card element to content container
        $("#browse-content-container").append(mediaCardEl);

    };

};


// renders browse page depending on media type variable- pulls data from appropriate API
function renderBrowsePage() {
    var mediaTypeEl = $("#media-type");

    if (mediaType === "books") {
        mediaTypeEl.text("Trending Books of the Week")

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
                    var listItem = response.results[i].display_name;
                    genreList.push(listItem);
                }
            };

            renderDropdown();
        });

        var listSelection = "hardcover-fiction";

        var nytBookTitlesUrl =
            nytBooksUrl + "/lists/current/" + listSelection + "?api-key=" + nytApiKey;
        $.ajax({
            url: nytBookTitlesUrl,
            method: "GET",
        }).then(function (bookResponse) {
            console.log(bookResponse);
            for (j = 0; j < bookResponse.results.books.length; j++) {

                // save data to variables
                title = bookResponse.results.books[j].title;
                author = bookResponse.results.books[j].contributor;
                imgURL = bookResponse.results.books[j].book_image;
                link = bookResponse.results.books[j].amazon_product_url;
                summary = bookResponse.results.books[j].description;

                // create new MediaCard object with variables
                var card = new MediaCard(title, author, imgURL, link, summary);

                // push new MediaCard to cardsArr
                cardsArr.push(card);
            }

            // render Trending cards to screen
            renderTrendingCards();
        });


    } else if (mediaType === "movies") {

        // change page title
        mediaTypeEl.text("Trending Movies of the Week")

        var trendURL = "https://api.themoviedb.org/3/trending/movie/day?api_key=660bf8330423e5658590b1cdb677dc08"
        // var apiKey = "660bf8330423e5658590b1cdb677dc08";

        var genreDiction = {
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

        // render dropdown menu using genreDiction values
        var genresArr = Object.values(genreDiction);
        
        for (var i = 0; i < genresArr.length; i++) {
            genreList.push(genresArr[i]);
        };

        renderDropdown();

        // call trending movies data
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
                    anyString = anyString + ", " + genreDiction[myGenreids[j]]
                };

                var resString = anyString.substring(2);

                // save movie data to variables
                title = response.results[i].title;
                imgURL = "https://image.tmdb.org/t/p/w200/" + response.results[i].poster_path;
                // response.results[i].vote_average
                // resString
                summary = response.results[i].overview;


                // create new MediaCard object with variables
                var card = new MediaCard(title, author, imgURL, link, summary);

                // push new MediaCard to cardsArr
                cardsArr.push(card);
            };

            // render Trending cards to screen
            renderTrendingCards();
        });


    } else if (mediaType === "shows") {

        // call tv show data
        mediaTypeEl.text("Trending TV Shows of the Week")

    }
};



// define init function
function init() {
    getStorage();
    renderBrowsePage();
};

// call init
init();
