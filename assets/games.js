const apiKey = "46084e24a024412a953f007daebfa62c";

// Hakee pelejä API:sta ja luo niistä kortit index.html:ään. 
// Näyttää pelin nimen, julkaisupäivän, kuvan ja arvosanan.
// Tehty eri tiedostoon, jotta sivut pysyy siistinä.

// Funktio, joka luo pelin kortin HTML-muodossa, erikseen että toimii modulaarisesti molemmilla sivuilla
function createGameCard(game) {
    return `<div class="col-lg-4 col-md-6">

                <div class="card game-card h-100"
                onclick="openGameDetails(${game.id})"
                style="cursor:pointer">

                <img 
                src="${game.background_image || 'assets/img/placeholder.jpg'}"
                class="card-img-top"
                alt="Cover image of the video game ${game.name}">

                    <div class="card-body">

                        <h5 class="card-title">${game.name}</h5>

                        <p class="card-text">
                        Release: ${game.released || "N/A"}
                        </p>

                        <span class="badge badge-rating">✮ ${game.rating}</span>

                    </div>
                </div>

            </div>
                    `;
}


// Hakee pelit etusivua varten
function fetchGames() {

    // Haetaan elementti, johon pelit laitetaan
    const container = document.getElementById("game-list");
    if (!container) return;

    // Haetaan pelejä API:sta
    try {
        container.innerHTML = "Loading...";
        fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=18`)
            .then(res => res.json())
            .then(data => {

                container.innerHTML = "";

                data.results.forEach(game => {
                    container.innerHTML += createGameCard(game);
                });

            })
    } catch (error) {
        console.error("Pelien haussa tapahtui virhe:", error);
    }
}


// Haku-funktio, joka hakee pelejä API:sta ja näyttää ne
function setupSearch() {

    const searchInput = document.getElementById("search-input");
    const container = document.getElementById("search-results");

    // Varmistetaan, että elementit löytyy ennen kuin yritetään käyttää niitä
    if (!searchInput || !container) return;

    // Kuunnellaan näppäimistön tapahtumia hakukentässä
    searchInput.addEventListener("keyup", (e) => {

        const query = e.target.value;

        // Vähintään 2 merkkiä, ennen kuin haetaan API:sta
        if (query.length < 2) {
            container.innerHTML = "";
            return;
        }

        // Haetaan pelejä API:sta hakusanan perusteella
        try {
            container.innerHTML = "Loading...";
            fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}`)
                .then(res => res.json())
                .then(data => {

                    container.innerHTML = "";

                    data.results.forEach(game => {
                        container.innerHTML += createGameCard(game);
                    });

                });

        } catch (error) {
            console.error("Haun aikana tapahtui virhe:", error);
        }

    });

}

// Funktio, joka avaa pelin yksityiskohdat modaalissa, hakee pelin tiedot API:sta ja näyttää ne
function openGameDetails(gameId) {

    // Haetaan pelin tiedot API:sta ID:n perusteella, kun korttia klikataan
    try {
        fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`)
            .then(res => res.json())
            .then(game => {

                document.getElementById("modal-title").innerText = game.name;

                // Muodostetaan genre-lista, joka näytetään modaalissa
                const genres = game.genres.map(g => g.name).join(", ");

                // Asetetaan modaalin sisältö pelin tiedoilla, kuten kuva, julkaisupäivä, arvosana, genret ja kuvaus.
                document.getElementById("modal-body").innerHTML = `

                <img src="${game.background_image}" 
                class="img-fluid mb-3 rounded">

                    <p><strong>Released:</strong> ${game.released || "N/A"}</p>

                    <p><strong>Rating:</strong> ✮ ${game.rating}</p>

                    <p><strong>Genres:</strong> ${genres}</p>

                <p>${game.description_raw ? game.description_raw.substring(0, 400) + "..." : ""}</p>

                `;

                // Näytetään modaalin, kun tiedot on asetettu
                const modal = new bootstrap.Modal(document.getElementById("gameModal"));
                modal.show();

            });

    } catch (error) {
        console.error("Pelien haussa tapahtui virhe:", error);
    }

}

// Kun sivu on ladattu, haetaan pelit ja asetetaan hakukenttä toimimaan
document.addEventListener("DOMContentLoaded", () => {

    fetchGames();
    setupSearch();

});