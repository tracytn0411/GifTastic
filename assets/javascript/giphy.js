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

    $(".btn-primary").on("click", function(event) {
        event.preventDefault();
        
        var tvTitle = $(this).attr("tv_title");
        console.log(tvTitle);
    
        var u = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + tvTitle + "&limit=10&rating=G&lang=en"; 
        console.log(u);
    
        $.ajax({
            url: u,
            method: "GET"
        }).done(function (response) {
            console.log(response.data);
            var tvObs = response.data;
    
            $.each(tvObs, function(){
                var divGif = $("<div>").addClass("gify");
                var displayRating = $("<p>").html("Rating: " + this.rating);
    
                var gifImg = $("<img>").addClass("gif").attr({
                    "src" : this.images.fixed_height_still.url,
                })
    
                divGif.append(displayRating);
                divGif.prepend(gifImg);
    
                $("#resultDisplay").append(divGif);
            });
        });
    })
}

})