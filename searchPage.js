const params = new URL(location).searchParams;
const popularFilms = document.getElementById("popularfilms");
const query = params.get("query");

const API_URL = "https://films-watchlist.herokuapp.com/";

// THis function adds a movie to the watchlist and refreshes the paage
const AddToWatchList = (movie_id) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.email);
      axios
        .post(`${API_URL}movies/watchlist/create`, {
          id: movie_id,
          email: user.email,
        })
        .then((data) => {
          console.log(data);
          location.reload();
        });
    }
  });
  // axios
  //   .post(`${API_URL}movies/watchlist/create`, { id: movie_id })
  //   .then((data) => {
  //     console.log(data);
  //     location.reload();
  //   });
};

// This function gets the search result from the SearchTitle route and loops through all the movies and gets the plot to show the results
const getSearchResults = async () => {
  if (query == null) {
    popularFilms.innerHTML = "";
  } else {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        axios.get(`${API_URL}movies/SearchTitle/${query}`).then((res) => {
          const movies = res.data.results;
          let htmlCode = "";

          movies.forEach((movie) => {
            console.log(movie);
            let buttonHtml = "";
            Promise.all([
              axios.get(`${API_URL}movies/watchlist/${movie.id}/${user.email}`),
              axios.get(`${API_URL}movies/Title/${movie.id}/`),
              axios.get(`${API_URL}movies/Ratings/${movie.id}/`),
            ]).then((values) => {
              console.log(values[2].data);
              let ratingHtml = `<div class="ratings">`;
              if (values[0].data.length == 0) {
                buttonHtml = `<button class="btn btn-outline-danger" onclick="AddToWatchList('${movie.id}') ">Add</button>`;
              } else {
                buttonHtml = "";
              }
              if (values[2].data.imDb.length != 0) {
                ratingHtml += `<div class="rating"><p id="ratingTitle">IMDb Rating</p><p id="ratingNumber">${values[2].data.imDb}/10</p></div>`;
              }
              if (values[2].data.rottenTomatoes.length != 0) {
                ratingHtml += `<div class="rating"><p id="ratingTitle">Rotten Tomatoes Rating</p><p id="ratingNumber">${values[2].data.rottenTomatoes}%</p></div>`;
              }
              ratingHtml += `</div>`;

              htmlCode += `<div class="singleMovie">
                  <img
                    src=${movie.image}
                    alt=""
                  />
                  <div class="movieDescription">
                    <h3>${movie.title}</h3>
                    <p>
                    ${values[1].data.plot}
                    </p>
                    ${ratingHtml}
                    ${buttonHtml}
                  </div>
                </div>`;
              popularFilms.innerHTML = htmlCode;
            });
          });
        });
      }
    });
  }
};
