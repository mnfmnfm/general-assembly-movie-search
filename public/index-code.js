// The array with the current movies displayed by our app.
var moviesArr = [];
// The element that currently has an expanded detail view.
var detailViewLi = null;

function search() {
	// Extract the search terms from the text box.
	var searchTerms = document.getElementsByClassName("search-box")[0].value;
	// Set up request to OMDb; specify that when it's done, call displayMovies.
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			moviesArr = JSON.parse(xmlHttp.responseText)['Search'];
            displayMovies(moviesArr);
    	}
	};
	// Send request to OMDb
    xmlHttp.open("GET", "https://www.omdbapi.com/?s=" + searchTerms + "&type=movie", true);
    xmlHttp.send(null);
}

function displayFavorites() {
	// Set up request to our own backend, again specifying that we call displayMovies afterwards.
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			moviesArr = JSON.parse(xmlHttp.responseText);
            displayMovies(moviesArr);
    	}
	};
	// Send request to OMDb
    xmlHttp.open("GET", "/favorites", true);
    xmlHttp.send(null);
}

// A function to display an array of movies 
function displayMovies(moviesArr) {
	// Find the element where we display results, and remove what's already there.
	var resultsElt = document.getElementsByClassName("results")[0];
	while (resultsElt.firstChild) {
		resultsElt.removeChild(resultsElt.firstChild);
	}
	// Set up a quick function generator, to avoid the iterating-callback problem.
	var genFun = function(movie, li) {
		return function() {
			movieClicked(movie, li);
		};
	};
	// Iterate through the results, putting each one into a basic HTML template.
	for (var movie in moviesArr) {
		var li = document.createElement("li");
		li.classList.add("movie");
		li.innerHTML = moviesArr[movie]['Title'];
		li.onclick = genFun(movie, li);
		resultsElt.appendChild(li);
	}
	if (!moviesArr || moviesArr.length === 0) {
		li = document.createElement("li");
		li.classList.add("movie");
		li.innerHTML = "No movies found.";
		resultsElt.appendChild(li);
	}
}

function movieClicked(movie, li) {
	// Remove the detail view from our previously-expanded list item.
	if (detailViewLi) {
		detailViewLi.removeChild(detailViewLi.lastChild);
		detailViewLi.classList.remove("expanded");
	}
	detailViewLi = li;
	li.classList.add("expanded");

	// Create and append the detail view.
	var detailView = document.createElement("div");
	detailView.classList.add("detail");
	var img = document.createElement("img");
	img.classList.add("poster");
	img.src = moviesArr[movie]["Poster"];
	detailView.appendChild(img);
	var titleDiv = document.createElement("div");
	titleDiv.innerHTML = 'Title: ' + moviesArr[movie]['Title'];
	detailView.appendChild(titleDiv);
	var yearSpan = document.createElement("div");
	yearSpan.innerHTML = 'Year released: ' + moviesArr[movie]['Year'];
	detailView.appendChild(yearSpan);
	
	
	var addToFavorites = document.createElement("button");
	addToFavorites.innerHTML = 'Add to Favorites';
	addToFavorites.onclick = function() {
		addFavorite(movie);
	}
	detailView.appendChild(addToFavorites);
	
	
	li.appendChild(detailView);
}

function addFavorite(movie) {
	// Set up and send request to our backend.
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/favorites", true);
    var requestText = JSON.stringify(moviesArr[movie]);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var successElt = document.createElement("div");
            successElt.innerHTML = 'Added to favorites!';
            var elt = document.getElementsByClassName("detail")[0];
            elt.appendChild(successElt);
    	}
	};
    xmlHttp.send(requestText);
}

function clearFavorites() {
	// Set up and send request to our backend.
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/favorites-clear", true);
    xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var successElt = document.createElement("div");
            successElt.innerHTML = 'Favorites cleared!';
            var elt = document.getElementsByClassName("buttons-div")[0];
            elt.appendChild(successElt);
    	}
	};
    xmlHttp.send(null);
}
