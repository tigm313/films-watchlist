const API_URL = "https://films-watchlist.herokuapp.com/";
const watchlist = document.getElementById("watchlist");
// THis function removes a movie from the watchlist and refreshes the paage
const deleteFromWatchList = (movie_id) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      axios
        .delete(`${API_URL}movies/watchlist/${movie_id}/${user.email}`)
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

// This functions redirects user to the search page
const redirectToSearchPage = () => {
  location.replace(location.origin + "/SearchPage.html");
};

//This function gets all the watchlist item from the database  and loops through all the movies and gets the plot to show the results
const getAllData = async () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      axios.get(`${API_URL}movies/watchlist/${user.email}`).then((res) => {
        const movies = res.data;
        let htmlCode = "";
        movies.forEach((movie) => {
          console.log(movie.Rating);
          let ratingHtml = `<div class="ratings">`;
          if (movie.Rating.imDb.length != 0) {
            ratingHtml += `<div class="rating"><p id="ratingTitle">IMDb Rating</p><p id="ratingNumber">${movie.Rating.imDb}/10</p></div>`;
          }
          if (movie.Rating.rottenTomatoes.length != 0) {
            ratingHtml += `<div class="rating"><p id="ratingTitle">Rotten Tomatoes Rating</p><p id="ratingNumber">${movie.Rating.rottenTomatoes}%</p></div>`;
          }
          ratingHtml += `</div>`;
          htmlCode += `<div class="singleMovie">
                <img
                  src=${movie.image}
                  alt=""
                />
                <div class="movieDescription">
                  <h3>${movie.fullTitle}</h3>
                  <p>${movie.plot}</p>
                  ${ratingHtml}
                  <button class="btn btn-outline-danger" onclick="deleteFromWatchList('${movie.id}') ">Remove</button>
                </div>
              </div>`;
        });

        if (movies.length == 0) {
          watchlist.innerHTML = `<h2>No movies in you watch list</h2> <h5> Search and add new movies</h5><button class='btn btn-outline-primary' onclick="redirectToSearchPage()">Search Page</button/>`;
        } else {
          watchlist.innerHTML = htmlCode;
        }
      });
    }
  });
};
