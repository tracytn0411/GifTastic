$(function(){

var topics = ["The Office", "Silicon Valley", "South Park", "Arrested Development", "Breaking Bad", "The Big Bang Theory", "The IT Crowd", "Friends", "Green Wings"];

var tvTitle;
var offSet; //offset value for load more button
displayButton();

function displayButton() {
    
    $.each (topics, function() {
        var button = $("<button>").addClass("btn btn-primary").text(this).attr({
            "id" : "tvshow",
            "tv_title" : this,
        })
        $("#topicDisplay").append(button);
    });
}

$(document).on("click", ".btn-primary", function() {
    
    //empty content so only 10 gifs display at a time
    $("#resultDisplay").empty(); 
    offSet = 10;

    //display load more button at the end 
    $("#load-more").show();

    tvTitle = $(this).attr("tv_title");
    console.log(tvTitle);

    //limit = 10 -> max 10 gifs display
    //rating: omit -> include all ratings
    var u = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + tvTitle + "&limit=10&offset=" + offSet + "&lang=en"; 
    console.log(u);

    $.ajax({
        url: u,
        method: "GET"
    }).done(function (response) {
        var tvObs = response.data;

        $.each(tvObs, function(){ //this = each tvObs 
            var divGif = $("<div>").addClass("col-4 gify");
            var displayRating = $("<p>").html("Rating: " + this.rating);

            var gifImg = $("<img>").addClass("img-fluid gif").attr({
                "src" : this.images.fixed_height_still.url,
                "data-still" : this.images.fixed_height_still.url,
                "data-animate" : this.images.fixed_height.url,
                "data-state" : "still", //toggle play or pause gif between clicks
            });

            divGif.append(displayRating);
            divGif.prepend(gifImg);
            $("#resultDisplay").append(divGif);
        });
    });
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
    displayButton(); // display new set of tv show buttons
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

$("#load-more").on("click", function(){
    offSet += 10; //load the next 10 gifs 

    var y = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + tvTitle + "&limit=10&offset=" + offSet + "&lang=en";

    console.log(y);

    $.ajax({
        url: y,
        method: "GET"
    }).done(function (response) {
        var tvObs = response.data;

        $.each(tvObs, function(){ //this = each tvObs 
            var divGif = $("<div>").addClass("col-4 gify");
            var displayRating = $("<p>").html("Rating: " + this.rating);

            var gifImg = $("<img>").addClass("img-fluid gif").attr({
                "src" : this.images.fixed_height_still.url,
                "data-still" : this.images.fixed_height_still.url,
                "data-animate" : this.images.fixed_height.url,
                "data-state" : "still", //toggle play or pause gif between clicks
            });

            divGif.append(displayRating);
            divGif.prepend(gifImg);
            $("#resultDisplay").append(divGif);
        });
    });


    

})

})