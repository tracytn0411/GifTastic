$(function(){

var topics = ["The Office", "Silicon Valley", "South Park", "Arrested Development", "Breaking Bad", "The Big Bang Theory", "The IT Crowd", "Friends", "Green Wings"];

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
        //event.preventDefault();
        $("#resultDisplay").empty(); //empty content so only 10 gifs display at a time

        var tvTitle = $(this).attr("tv_title");
        console.log(tvTitle);
    
        //limit = 10 -> max 10 gifs display
        //rating = G -> general rating, good for all ages
        var u = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + tvTitle + "&limit=10&rating=G&lang=en"; 
        console.log(u);
    
        $.ajax({
            url: u,
            method: "GET"
        }).done(function (response) {
            //console.log(response.data);
            var tvObs = response.data;
    
            $.each(tvObs, function(){ //this = each tvObs 
                var divGif = $("<div>").addClass("col-4 gify");
                var displayRating = $("<p>").html("Rating: " + this.rating);
    
                var gifImg = $("<img>").addClass("img-fluid gif").attr({
                    "src" : this.images.fixed_height_still.url,
                    "data_still" : this.images.fixed_height_still.url,
                    "data_animate" : this.images.fixed_height.url,
                    "data_state" : "still",
                });

                //console.log(this.images.fixed_height_still.url)
    
                divGif.append(displayRating);
                divGif.prepend(gifImg);
    
                $("#resultDisplay").append(divGif);
            });
        });
    });

$("#submit_btn").on("click", function(event){
    event.preventDefault();
    $("#topicDisplay").empty();
    var newTvshow = $("#userInput").val().trim();
    console.log(newTvshow);
    topics.push(newTvshow);
    console.log(topics);
    displayButton();
})


    //! $(."gif").on("click", function())} won't work here
$(document).on("click", ".gif", function (){
    var gifState = $(this).attr("data_state");

    if (gifState === "still"){
         $(this).attr("src", $(this).attr("data_animate"));
        $(this).attr("data_state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data_still"));
        $(this).attr("data_state", "still");
    }


})

})