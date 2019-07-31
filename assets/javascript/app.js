$(function(){

var topics = ["Forrest Gump", "About Time", "Love Actually", "Rain Man", "The Green Mile", "As Good As It Gets", "The Pursuit of Happyness", "Eternal Sunshine of the Spotless Mind", "Leon: The Professional"];

var title;
var encodedTitle;
var offSet; //offset value for load more button
renderButtons();

function renderButtons() {
    
    $.each (topics, function() {
        var button = $("<button>").addClass("btn btn-primary").text(this).attr({
            "id" : "tvshow",
            "movie_title" : this,
        })
        $("#topicDisplay").append(button);
    });
}

$(document).on("click", ".btn-primary", function() {
    
    //empty content so only 10 gifs display at a time
    $("#gifsDisplay").empty(); 
    offSet = 10;

    //display load more button at the end 
    $("#load-more").show();

    title = $(this).attr("movie_title");
    var movieTitle = title; //Add "movie" to q search for specific purpose
    
    //encode param in url --> replace space in title with %20
    encodedTitle = encodeURIComponent(movieTitle);
    console.log(encodedTitle); 

    //limit = 10 -> max 10 gifs display
    //rating: omit -> include all ratings
    var giphyUrl = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + encodedTitle + "%20&limit=10&offset=" + offSet + "&lang=en"; 
    console.log(giphyUrl);

    $.ajax({
        url: giphyUrl,
        method: "GET"
    }).done(function (response) {
        var giphyObs = response.data;

        $.each(giphyObs, function(){ //this = each giphyObs 
            var divGif = $("<div>").addClass("col-4 gify");
            var gifRating = $("<p>").html("Rating: " + this.rating);
            var gifTitle = $("<p>").html("Title: " + this.title);

            var gifImg = $("<img>").addClass("img-fluid gif").attr({
                "src" : this.images.fixed_height_still.url,
                "data-still" : this.images.fixed_height_still.url,
                "data-animate" : this.images.fixed_height.url,
                "data-state" : "still", //toggle play or pause gif between clicks
            });

            divGif.append(gifTitle);
            divGif.append(gifRating);
            divGif.prepend(gifImg);
            $("#gifsDisplay").append(divGif);
        });
    });

    var omdbUrl = "http://www.omdbapi.com/?t=" + encodedTitle + "&apikey=7328c6f";
    console.log(omdbUrl);

    $.ajax({
        url: omdbUrl,
        method: "GET"
    }).done(function (response) { 
        var omdbObs = response;
        console.log(omdbObs);

        var divPoster = $("<div>").addClass("col-12");
        var posterImg = $("<img>").addClass("img-fluid").attr("src", omdbObs.Poster);
        var posterTitle = $("<h5>").text(omdbObs.Title);

        divPoster.append(posterImg);
        divPoster.append(posterTitle);
        $("#posterDisplay").append(divPoster);



       

        // $.each(omdbObs, function () { 
        //     var divOmdb = $("<div>")

        // });




     })
    ;

});

$("#submit_btn").on("click", function(event){
    //prevent the form from submitting itself
        //user can hit enter to submit input
    event.preventDefault();

    //empty all tv show buttons before the new buttons array runs
        //to prevent duplicate buttons
    $("#topicDisplay").empty();
    var newTvshow = $("#userInput").val().trim();
    topics.push(newTvshow); //add user input to topics array
    renderButtons(); // display new set of tv show buttons
})

    //! $(."gif").on("click", function())} won't work here
    $(document).on("click", ".gif", function (){
    var gifState = $(this).attr("data-state");

    if (gifState === "still"){
        //then take out data-animate and put it into src
        $(this).attr("src", $(this).attr("data-animate"));
        //and updata data0-state to animated
        $(this).attr("data-state", "animated");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
})

//------------------------------------------------------------------------
// Pagination Objects: total_count: # of all available items on website, count: # of items returned (in this assigment, 10), offset: position in pagination

$("#load-more").on("click", function(event){

    event.preventDefault(); //prevent page scroll to the top
    
    offSet += 10; //load the next 10 gifs 

    var y = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + title + "&limit=10&offset=" + offSet + "&lang=en";
    console.log(y);

    $.ajax({
        url: y,
        method: "GET"
    }).done(function (response) {
        var giphyObs = response.data;

        $.each(giphyObs, function(){ //this = each giphyObs 
            var divGif = $("<div>").addClass("col-4 gify");
            var gifRating = $("<p>").html("Rating: " + this.rating);

            var gifImg = $("<img>").addClass("img-fluid gif").attr({
                "src" : this.images.fixed_height_still.url,
                "data-still" : this.images.fixed_height_still.url,
                "data-animate" : this.images.fixed_height.url,
                "data-state" : "still", //toggle play or pause gif between clicks
            });

            divGif.append(gifRating);
            divGif.prepend(gifImg);
            $("#gifsDisplay").append(divGif);
        });
    });


    

})

})