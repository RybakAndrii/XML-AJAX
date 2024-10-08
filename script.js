const API_KEY = "9db49f6c";

$(document).ready(function () {
  let currentPage = 1;
  let currentSearch = "";

  $("#search-form").submit(function (e) {
    e.preventDefault();
    currentPage = 1;
    currentSearch = $("#search-input").val();
    searchMovies(currentSearch, $("#type-select").val(), currentPage);
  });

  function searchMovies(search, type, page) {
    $.ajax({
      url: `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&type=${type}&page=${page}`,
      method: "GET",
      success: function (data) {
        if (data.Response === "True") {
          displayMovies(data.Search);
          setupPagination(Math.ceil(data.totalResults / 10), page);
        } else {
          $("#results").html("<p>Movie not found!</p>");
          $("#pagination").html("");
          $("#movie-details").html("");
        }
      },
    });
  }

  function displayMovies(movies) {
    let output = "";
    movies.forEach((movie) => {
      output += `
                <div class="movie-item">
                    <p>${movie.Title} (${movie.Year})</p>
                    <button class="details-btn" data-id="${movie.imdbID}">Details</button>
                </div>
            `;
    });
    $("#results").html(output);
    $("#movie-details").html("");
  }

  function setupPagination(totalPages, currentPage) {
    let paginationOutput = "";
    for (let i = 1; i <= totalPages; i++) {
      paginationOutput += `<span class="page-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</span>`;
    }
    $("#pagination").html(paginationOutput);
  }

  $("#pagination").on("click", ".page-btn", function () {
    let page = $(this).data("page");
    searchMovies(currentSearch, $("#type-select").val(), page);
  });

  $("#results").on("click", ".details-btn", function () {
    let imdbID = $(this).data("id");
    showMovieDetails(imdbID);
  });

  function showMovieDetails(imdbID) {
    $.ajax({
      url: `http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`,
      method: "GET",
      success: function (data) {
        let details = `
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <p><strong>Actors:</strong> ${data.Actors}</p>
                    <img src="${
                      data.Poster !== "N/A" ? data.Poster : ""
                    }" alt="Poster">
                `;
        $("#movie-details").html(details);
      },
    });
  }
});
