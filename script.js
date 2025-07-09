const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");
const loadingIndicator = document.getElementById("loading");

function showLoading(show) {
  loadingIndicator.classList.toggle("hidden", !show);
}

function searchBreweries() {
  const city = searchInput.value.trim();
  const state = document.getElementById("stateSelect").value;
  const type = document.getElementById("typeSelect").value;

  //Input validation: require at least one filter
  if (!city && !state && !type) {
    resultsContainer.innerHTML = "<p style='color:red;'>⚠️ Please enter a city, state, or brewery type to search.</p>";
    return;
  }

  let url = "https://api.openbrewerydb.org/v1/breweries?per_page=30";
  if (city) url += `&by_city=${encodeURIComponent(city)}`;
  if (state) url += `&by_state=${encodeURIComponent(state)}`;
  if (type) url += `&by_type=${encodeURIComponent(type)}`;

  resultsContainer.innerHTML = "";
  showLoading(true);

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      showLoading(false);
      displayResults(data);
    })
    .catch((error) => {
      showLoading(false);
      console.error("API Error:", error);
      resultsContainer.innerHTML =
        "<p style='color: red;'>❌ Failed to load data. Try again later.</p>";
    });
}

function displayResults(breweries) {
  if (!breweries || breweries.length === 0) {
    resultsContainer.innerHTML = "<p style='color: orange;'>😕 No breweries found for that filter.</p>";
    return;
  }

  breweries.forEach((brewery) => {
    const div = document.createElement("div");
    div.className = "brewery";
    const stateKey = (brewery.state || "").toLowerCase().replace(/\s/g, "_");
    const logoPath = `./assets/${stateKey}.jpeg`;

    div.innerHTML = `
      <div class="brewery-content">
        <div class="brewery-text">
          <h3>${brewery.name}</h3>
          <p><strong>Type:</strong> ${brewery.brewery_type || "N/A"}</p>
          <p><strong>Location:</strong> ${brewery.city || ""}, ${brewery.state || ""}</p>
          ${
            brewery.website_url
              ? `<p><a href="${brewery.website_url}" target="_blank">🌐 Visit Website</a></p>`
              : ""
          }
        </div>
        <img src="${logoPath}" alt="${brewery.state} Logo" class="state-logo" onerror="this.style.display='none';" />
      </div>
    `;

    resultsContainer.appendChild(div);
  });
}
