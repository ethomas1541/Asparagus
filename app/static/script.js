async function getAuthToken(apiKey) {
    const url = 'https://api4.thetvdb.com/v4/login';
    const payload = { apikey: apiKey };
    const headers = { 'Content-Type': 'application/json' };

    try {
        const response = await axios.post(url, payload, { headers });
        if (response.data && response.data.data && response.data.data.token) {
            return response.data.data.token;
        } else {
            throw new Error("Authentication failed: 'token' not found in the response");
        }
    } catch (error) {
        console.error("Authentication error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function searchSeries(token, seriesName) {
    const url = `https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(seriesName)}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        console.log(response.data); // Debugging line to check the data structure
        return response.data;
    } catch (error) {
        console.error("Search series error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function add_show() {
    const API_KEY = 'fefac935-f11a-4342-87fc-59e8ee37995e';
    let token;

    try {
        token = await getAuthToken(API_KEY);
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return;
    }

    const seriesName = prompt("Enter the name of the show:");
    if (!seriesName) return;

    let searchResults;
    try {
        searchResults = await searchSeries(token, seriesName);
    } catch (error) {
        console.error('Failed to search for series:', error);
        return;
    }

    let firstResult;
    let seriesDescription;
    let seriesImage;

    if (searchResults.data && searchResults.data.length > 0) {
        firstResult = searchResults.data[0];
        seriesDescription = firstResult.overview || "Description not available.";
        seriesImage = firstResult.image_url ? firstResult.image_url : "static/img/sample.png";
    } else {
        firstResult = { name: seriesName };
        seriesDescription = "No information available.";
        seriesImage = "static/img/sample.png";
    }

    // Create list element to hold show card
    let show_card = document.createElement("li");

    // Set list element class and id
    show_card.className = "show";
    show_card.id = "show card";

    // Fill in show card with html elements
    show_card.innerHTML = `
        <h2 contenteditable="true" spellcheck="false">${firstResult.name}</h2>
        <div class="showbox">
            <div class="img-frame">
                <img src="${seriesImage}">
            </div>
            <div class="show-description" contenteditable="true">
                <p spellcheck="false">${seriesDescription}</p>
            </div>
            <div class="remove-show-container">
                <button class="remove-show" onclick="remove_show(this)">Remove Show</button>
            </div>
            <div class="progbar">
                <input class="current-ep" type="number" dir="rtl" min="0" maxlength="4" placeholder="####">
                <p id="divider">/</p>
                <p id="total-ep">22</p>
                <div class="meter-bg"></div>
                <div class="meter"></div>
            </div>
            <div class="ratings">
                <div class="star-bg">
                    <div class="star-darkgray"></div>
                    <div class="star-yellow"></div>
                    <img src="static/img/starframe.png">
                    <div class="star-buttons">
                        <button id="b1star"></button>
                        <button id="b2star"></button>
                        <button id="b3star"></button>
                        <button id="b4star"></button>
                        <button id="b5star"></button>
                    </div>
                </div>
                <div class="number-bg">
                    <input class="rating" type="number" placeholder="--" min="0.0" max="5.0" step="0.5">
                </div>
            </div>
        </div>
    `;

    // Add show card to top of list
    const list = document.getElementById("show_list");
    list.insertBefore(show_card, list.children[0]);
}

function remove_show(elemRef) {
    /*  elemRef is the element that called remove_show
        IMPORTANT! if remove-show button is moved will need to update!
    */

    // Gets the great-grandparent of elemRef 
    var show_card = elemRef.parentElement.parentElement.parentElement;

    // set display to none so user cannot see it anymore 
    show_card.style.display = "none";
}

function levenshtein(a, b) {
    const matrix = [];
    let i, j;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function searchShows() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const shows = Array.from(document.querySelectorAll('#show_list .show'));
    
    // Compute distances
    const showDistances = shows.map(show => {
        const showName = show.querySelector('h2').textContent.toLowerCase();
        return { show, distance: levenshtein(searchTerm, showName) };
    });

    // Sort by distance
    showDistances.sort((a, b) => a.distance - b.distance);

    // Update display
    showDistances.forEach(({ show }, index) => {
        show.style.order = index;  // Use flexbox order property
        show.style.display = show.querySelector('h2').textContent.toLowerCase().includes(searchTerm) ? 'block' : 'none';
    });
}

function clearSearch() {
    document.getElementById('searchBar').value = '';
    const shows = document.querySelectorAll('#show_list .show');
    shows.forEach(show => {
        show.style.display = 'block';
        show.style.order = 0;
    });
}

function acc_login() {
    alert("Login Implementation Coming Soon...");
}

function create_acc() {
    alert("Account Creation Implementation Coming Soon...");
}