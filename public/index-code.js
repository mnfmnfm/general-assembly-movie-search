// The array we'll use to store the current movies displayed by our app.
var moviesArr = [];
// The element that currently has an expanded detail view.
var detailViewLi = null;

function search() {
	// Extract the search terms from the text box.
	var searchTerms = document.getElementsByClassName("search-box")[0].value;
	// Set up request to OMDb; specify that when it's done, call displayResults
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            displayResults(xmlHttp.responseText);
    	}
	};
	// Send request to OMDb
    xmlHttp.open("GET", "http://www.omdbapi.com/?s=" + searchTerms + "&type=movie", true);
    xmlHttp.send(null);
}

function displayResults(results) {
	var resultsObj = JSON.parse(results);
	moviesArr = resultsObj['Search'];
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
		li.innerHTML = moviesArr[movie]['Title'];
		li.onclick = genFun(movie, li);
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
	var img = document.createElement("img");
	img.classList.add("poster");
	img.src = moviesArr[movie]["Poster"];
	detailView.appendChild(img);
	var titleSpan = document.createElement("span");
	titleSpan.innerHTML = 'Title: ' + moviesArr[movie]['Title'];
	detailView.appendChild(titleSpan);
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
	// Set up request
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/favorites", true);
    var requestText = JSON.stringify(moviesArr[movie]);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(requestText);
}