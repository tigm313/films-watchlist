

// this is for the nav search bar to redirect user to the search pag e
document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const searchQuery = document.getElementById("navSearchBar").value;
    location.replace(location.origin + "/SearchPage.html?query=" + searchQuery)
    console.log();
  });