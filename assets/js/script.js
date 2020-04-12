var mediaType;
var genreList = [];
getStorage();
renderBrowsePage();


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


// renders browse page depending on media type variable
function renderBrowsePage() {
    checkMediaType();

    var mediaTypeEl = $("#media-type")

    if (mediaType === "movies") {
        mediaTypeEl.text("Trending Movies of the Week")
    } else if (mediaType === "shows") {
        mediaTypeEl.text("Trending TV Shows of the Week")
    } else if (mediaType === "books") {
        mediaTypeEl.text("Trending Books of the Week")
    }
};

// function for event handler when user clicks on media link
function clickMediaType(type) {
    $('.nav-to-' + type ).on("click", function (event) {

        // only if you're own the browse page preventDefault
        if ($("body").is(".browse-page")) {
            event.preventDefault();
        };

        // empty dropdown options so they can be refilled
        $("#media-dropdown").empty();
        mediaType = type;
        setStorage();
        renderBrowsePage();
    });
};

// function for rendering dropdown menu based on genreList
function renderDropdown() {

    for (var i = 0; i < genreList.length; i++) {
        var $newOption = $("<option>")
        $newOption.text(genreList[i]);
        $("#media-dropdown").append($newOption);
    };

};

// function to check media type and call data accordingly
function checkMediaType() {
    if (mediaType === "books") {
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
                    var listItem = response.results[i].display_name;
                    genreList.push(listItem);
                }
            };

            renderDropdown();
        });

    } else if (mediaType === "movies") {

        // call movies data

    } else if (mediaType === "shows") {

        // call tv show data
        
    }
};


