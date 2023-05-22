function fetchAPOD() {
  var nasaURL = "https://api.nasa.gov/planetary/apod?api_key=1GOcJRVS7vlt3ePPXPquaxDi8gfduRVeFJwcemIN";

  $.ajax({
    url: nasaURL,
    success: function(result) {
      $("#apod-container").css("display", "block");
      if ("copyright" in result) {
        $("#apod-credit").text("Credit: " + result.copyright);
      } else {
        $("#apod-credit").text("Credit: " + "Public Domain");
      }

      if (result.media_type === "video") {
        $("#apod-vid").css("display", "block");
        $("#apod-vid").attr("src", result.url);
      } else {
        $("#apod-img").css("display", "block");
        $("#apod-img").attr("src", result.url);
      }
      $("#apod-explanation").text(result.explanation);
      $("#apod-title").text(result.title);
    }
  });

}

// NASA Image API Search
function search() {
  $("#temporary-banner").hide();
  $(".card-columns").empty();
  var searchTerm = $("#search_input").val();
  searchAJAX(undefined, searchTerm);
}

function searchAJAX(searchURL, searchTerm) {
  if (searchURL === undefined) {
    searchURL = "https://images-api.nasa.gov/search?q=" + searchTerm;
  }

  $.ajax({
    url: searchURL,
    success: function(result) {
      console.log(result);
      var totalHits = result.collection.metadata.total_hits;
      for (var i = 0; i < totalHits; i++) {
        if (result.collection.items[i] != undefined && result.collection.items[i].data[0].media_type == "image") {
          var title = result.collection.items[i].data[0].title;
          var thumbnail = result.collection.items[i].links[0].href;
          var card = "<div class='card gallery-card'><a href=" + thumbnail + " target='_blank'><img class='card-img-top' src='" + thumbnail + "' alt='" + title + "' /></a><div class='card-body' style='padding:0.5rem;'><p class='card-title'>" + title + "</p></div></div>";
          $(".card-columns").append(card);
        }
      }
      /*
      ** 
      ** This next piece of code allows the function to continue returning additional sets of API results (100 per API call) until there are no more pages of results.
      ** Instead of doing this automatically, there should be a button navigation implemented.
      **
      if (result.collection.links[0].rel === "next") {
        searchAJAX(result.collection.links[0].href, searchTerm);
      } else if (result.collection.links[1].rel === "next") {
        searchAJAX(result.collection.links[1].href, searchTerm);
      }
      */
    }
  });
}

function setSearchInput() {
  document.getElementById("search_input").onkeypress = function(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode == "13") {
      search();
      return false;
    }
  };
}
