
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
    })

    $(".nav-to-books").on("click", function(event) {
        event.preventDefault();
        console.log("clicked books")
        $("#media-type").text("Books");
    })

});