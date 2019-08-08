$(function () {

var topics = ["Forrest Gump", "Rain Man", "The Prestige", "About Time", "Love Actually", "The Green Mile", "As Good As It Gets", "Closer"];

var title;
var encodedTitle;
var offSet; //offset value for load more button
renderButtons();

//Create buttons for topics array
function renderButtons() {
	$.each(topics, function () {
		var button = $("<button>").addClass("btn btn-outline-secondary text-capitalize topicBtn").text(this).attr({
			"id": "tvshow",
			"movie_title": this,
		})
		$("#featuredMovies").append(button);
	});
}

//Function when topic button is clicked
$(document).on("click", ".topicBtn", function () {
	//empty content so only 10 gifs display at a time
	$("#gifsDisplay").empty();
	$("#posterDisplay").empty();

	//display load more button at the end 
	$("#load-more").show();

	title = $(this).attr("movie_title");
	//encode param in url --> replace space in title with %20
	encodedTitle = encodeURIComponent(title);
	console.log(encodedTitle);
	offSet = 10; //display the first 10 gifs from api source

	//++++Ajax calling Giphy API++++
	giphyURL();

	//++++Ajax calling Omdb API++++
	omdbURL();

});

//----------------GIPHY API------------------
//=======Function to call Gipphy API when topicBtn is clicked
function giphyURL() {
	var giphyUrl = "https://api.giphy.com/v1/gifs/search?api_key=fDUfRFjS2TdWvnNC2NYYCXaUXXv3VyAr&q=" + encodedTitle + "%20movie&limit=10&offset=" + offSet + "&lang=en"; //add %20movie
	console.log(giphyUrl);

	$.ajax({
		url: giphyUrl,
		method: "GET"
	}).done(function (response) {
		var giphyObs = response.data;

		$.each(giphyObs, function () { //this = each giphyObs 
			//var gifDivCol = $("<div>").addClass("col-md-4 col-sm-6 gify");
			//var divFlex = $("<div>").addClass("card-columns");
			var gifDivCard = $("<div>").addClass("card"); //style each gif 	with bootstrap card
			var gifCardBody = $("<div>").addClass("card-body");
			var upperRating = $("<span>").addClass("text-uppercase").text(this.rating); //transform rating value to uppercase
			var gifRating = $("<dd>").addClass("gifRating").html("Rating: ").append(upperRating);
			var gifTitle = $("<dt>").addClass("gifTitle text-truncate text-capitalize").html(this.title);
			var gifImg = $("<img>").addClass("card-img-top img-fluid gif").attr({
				"src": this.images.fixed_width_still.url,
				"data-still": this.images.fixed_width_still.url,
				"data-animate": this.images.fixed_width.url,
				"data-state": "still", //toggle play/pause
				"giphy-id" : this.id,
			});

			//Create 1-click download button
			var downloadIcon = $("<button>").addClass("btn download-btn").attr({
				"data-download": this.images.downsized_medium.url,
				"data-name": this.title,
			});
			downloadIcon.append("<i class='fa fa-download' aria-hidden='true'></i>");

			//Create favorite button (with font awesome heart icon)
			var heartIcon = $("<button>").addClass("btn heart-btn").attr({
				"src": this.images.fixed_height_small_still.url,
				"data-still": this.images.fixed_height_small_still.url,
				"data-animate": this.images.fixed_height_small.url,
				"data-state": "still",
				"giphy-id" : this.id,
				//download url
				"data-download": this.images.downsized_medium.url,
				"data-name": this.title,
				//heart icon
				"heart-state" : "empty",
			});

			heartIcon.append('<i class="fa fa-heart-o" aria-hidden="true"></i>');

			gifDivCard.prepend(gifImg);
			gifDivCard.append(gifCardBody);
			gifCardBody.append(gifTitle);
			gifCardBody.append(gifRating);

			gifCardBody.append(downloadIcon);
			gifCardBody.append(heartIcon);

			$("#gifsDisplay").append(gifDivCard);
		});
	});
}

//-------------------OMDB API--------------------
function omdbURL() {
	var omdbUrl = "https://www.omdbapi.com/?t=" + encodedTitle + "&apikey=7328c6f";
	console.log(omdbUrl);

	$.ajax({
		url: omdbUrl,
		method: "GET"
	}).done(function (response) {
		var omdb = response;
		console.log(omdb);

		//Display movie poster on the left
		var divLeft = $("<div>").addClass("col-md-6");
		divLeft.append(
			$("<img>").addClass("img-fluid").attr("src", omdb.Poster))

		//Display movie title, year, info on the right
		var divRight = $("<div>").addClass("col-md-5 text-left poster-info");
		divRight.append([
			$("<h4>").addClass("font-weight-bold pt-2").text(omdb.Title),
			$("<p>").text(omdb.Year),
			$("<p>").addClass("font-italic").text(omdb.Plot),
			$("<p>").addClass("font-weight-light").text(omdb.Actors),
		])

		$("#posterDisplay").append(divLeft);
		$("#posterDisplay").append(divRight);
	})
}

//------------USER MOVIES INPUT-----------------
$("#submit_btn").on("click", function (event) {
	//prevent the form from submitting itself
	//user can hit enter to submit input
	event.preventDefault();

	//empty all tv show buttons before the new buttons array runs
	//to prevent duplicate buttons
	$("#featuredMovies").empty();

	var newTvshow = $("#userInput").val().trim();

	if (newTvshow !== "") {
		topics.push(newTvshow); //add user input to topics array
		renderButtons(); // display new set of tv show buttons
	} else {
		renderButtons();
	}
})

//------PLAY/PAUSE GIF------
//! $(."gif").on("click", function())} won't work here
$(document).on("click", ".gif", function () {
	var gifState = $(this).attr("data-state");

	if (gifState === "still") {
		//then take out data-animate and put it into src
		$(this).attr("src", $(this).attr("data-animate"));
		//and updata data0-state to animated
		$(this).attr("data-state", "animated");
	} else {
		$(this).attr("src", $(this).attr("data-still"));
		$(this).attr("data-state", "still");
	}
})

//---------------------LOAD MORE BUTTON-------------------------------
// Pagination Objects: total_count: # of all available items on website, count: # of items returned (in this assigment, 10), offset: position in pagination
$("#load-more").on("click", function (event) {
	event.preventDefault(); //prevent page scroll to the top
	offSet += 10; //load the next 10 gifs 
	giphyURL();
})

//-----------  1-CLICK DOWNLOAD BUTTON ----------------
//-----Let user download file without setting up server
$(document).on('click', ".download-btn", function (event) {
	event.preventDefault();
	var downloadUrl = $(this).attr("data-download");
	var downloadName = $(this).attr("data-name");
	console.log(downloadUrl);

	$.ajax({
		url: downloadUrl,
		method: 'GET',
		xhrFields: {
			responseType: 'blob' //binary large object, default is text
		},
		success: function (data) {
			var a = document.createElement('a'); //create link in html
			var url = window.URL.createObjectURL(data); //API takes blob and return url below to access it
			a.href = url;
			a.download = downloadName;
			document.body.append(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url); //free up memory of object url
		}
	});
});

//======================FIREBASE========================================//
//----------- FAVORITE BUTTON ----------------
// Get a reference to the database service
var database = firebase.database();

//Hide favGifs display reel when there's no fav gifs
database.ref().on("value", function(snapshot){
	console.log(snapshot.exists()); //return true or false
	 if (snapshot.exists()){
		 $(".favDisplay").show();
	 }else{
		 $(".favDisplay").hide();
	 }
})

$(document).on("click", ".heart-btn", function () {
	event.preventDefault();

	//toggle font awesome heart icon with jQuery .toggleClass
	$(this).find(".fa-heart-o").toggleClass("fa-heart-o fa-heart");
	//$(this).prop("disabled",true); //disable button, prevent duplicate favorite
	var favGifUrl = $(this).attr("src");
	var favGifStill = $(this).attr("data-still");
	var favGifAnimate = $(this).attr("data-animate");
	var favGifTitle = $(this).attr("data-name");
	var favGifDownload = $(this).attr("data-download");
	var favGifID = $(this).attr("giphy-id");
	var heartIconState = $(this).attr("heart-state");
	if (heartIconState === "empty"){
		//toggle font awesome heart icon with jQuery .toggleClass
		$(this).find(".fa-heart-o").toggleClass("fa-heart-o fa-heart");
		$(this).attr("heart-state","filled");
		
		database.ref().push({
		giphyID : favGifID,
		giphyItem: favGifUrl,
		giphyStill: favGifStill,
		giphyAnimate: favGifAnimate,
		giphyTitle: favGifTitle,
		giphyDownload: favGifDownload,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});

	} else {
		$(this).find(".fa-heart").toggleClass("fa-heart fa-heart-o");
		$(this).attr("heart-state","empty");
		//database.ref().remove();
	}
})

database.ref().on("child_added", function (snapshot) {
	var id = snapshot.key; //long random key in database, use to remove later
	console.log(id);
	var fireData = snapshot.val();
	console.log(fireData.giphyItem);
 
	var favDivCard = $("<div>").addClass("card text-center fav-card p-1").attr("id", id);
	var favOverlay = $("<div>").addClass("card-footer");
	//Set img class gif trigger play/pause function above
	var favGifImg = $("<img>").addClass("card-img gif").attr({
		"src": fireData.giphyItem,
		"data-still": fireData.giphyStill,
		"data-animate": fireData.giphyAnimate,
		"data-state": "still",
	});

	//Keep download icon on fav gif, use same class to trigger download function above
	var favDownloadIcon = $("<button>").addClass("btn btn-sm m-1 p-0 download-btn").attr({
		"data-download": fireData.giphyDownload,
		"data-name": fireData.giphyTitle,
	});
	favDownloadIcon.append("<i class='fa fa-download' aria-hidden='true'></i>");

	//Create remove button
	var trashIcon = $("<button>").addClass("btn btn-sm m-1 p-0 remove-btn").attr("data", id); //use firekey to remove firebase data 
	trashIcon.append('<i class="fa fa-trash" aria-hidden="true"></i>');

	favDivCard.append(favGifImg);
	favDivCard.append(favOverlay);
	favOverlay.append(favDownloadIcon);
	favOverlay.append(trashIcon);
	$("#firebaseGif").append(favDivCard)
})

$(document).on("click", ".remove-btn", function () {
	event.preventDefault();
	var giphyKey = $(this).attr("data");
	console.log(giphyKey);
	//Find all key values
	var giphyRef = database.ref(giphyKey); //firebase path to item
	console.log(giphyRef);

	//Remove from database
	giphyRef.remove();

	//Remove from DOM
	$(this).parent().parent().remove(); //path to remove the whole div card
})

})