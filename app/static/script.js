function add_show() {
    // Create list element to hold show card
    let show_card = document.createElement("li");

    // Set list element class and id
    show_card.className = "show";
    show_card.id = "show card";

    // Fill in show card
    show_card.innerHTML = `
        <h2 contenteditable="true" spellcheck="false">Show Name</h2>
        <div class="showbox">
            <div class="img-frame">
                <img src="static/img/sample.png">
            </div>
            <div class="show-description" contenteditable="true">
                <p spellcheck="false">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ab hic, sunt non quaerat eveniet voluptate asperiores doloribus modi veritatis temporibus inventore officiis facere sed aut facilis aspernatur. Est, at. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur at est, architecto repellendus repellat maiores odit. Harum necessitatibus quia sunt ex esse laboriosam, veniam deserunt. Adipisci perspiciatis suscipit qui vitae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam minima ea numquam placeat. Necessitatibus, eos pariatur beatae explicabo suscipit architecto commodi dolorem odit, error temporibus, quidem ab corrupti consequuntur repellat? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores facere mollitia fuga illo repellendus voluptate ratione alias cum aliquid quo reiciendis, consequatur debitis odio excepturi, est asperiores laborum non architecto?</p>
            </div>
            <div class="progbar">
                <input class="current-ep" type="number" dir="rtl" min="0" maxlength="4" placeholder="####">
                <p id="divider">/</p>
                <p id="total-ep">####</p>
                <div class="meter"></div>
            </div>
            <div class="ratings">
                <div class="star-bg">
                    <div class="star-darkgray"></div>
                    <div class="star-yellow"></div>
                    <img src="static/img/starframe.png">
                    <div class = "star-buttons">
                            <button id = "b1star"></button>
                            <button id = "b2star"></button>
                            <button id = "b3star"></button>
                            <button id = "b4star"></button>
                            <button id = "b5star"></button>
                    </div>
                </div>
                <div class="number-bg">
                    <input class = "rating" type="number" placeholder="#.#" min="0.0" max="5.0" step="0.5">
                </div>
            </div>
        </div>
    `;

    // Append element to end of list
    document.getElementById("show_list").appendChild(show_card);
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