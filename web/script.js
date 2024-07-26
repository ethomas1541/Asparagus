function add_show(){

    // Create list element to hold show card
    let show_card = document.createElement("li");
    
    // Set list element class and id
    show_card.className = "show";
    show_card.id = "show card";

    // Fill in show card
    show_card.innerHTML = innerHTML = `
        <h2>Show Name</h2>
        <div class="showbox">
            <div class="img-frame">
                <img src="img/sample.png">
            </div>
            <div class="show-description" contenteditable="true">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ab hic, sunt non quaerat eveniet voluptate asperiores doloribus modi veritatis temporibus inventore officiis facere sed aut facilis aspernatur. Est, at. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur at est, architecto repellendus repellat maiores odit. Harum necessitatibus quia sunt ex esse laboriosam, veniam deserunt. Adipisci perspiciatis suscipit qui vitae? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam minima ea numquam placeat. Necessitatibus, eos pariatur beatae explicabo suscipit architecto commodi dolorem odit, error temporibus, quidem ab corrupti consequuntur repellat? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores facere mollitia fuga illo repellendus voluptate ratione alias cum aliquid quo reiciendis, consequatur debitis odio excepturi, est asperiores laborum non architecto?</p>
            </div>
            <div class = "progbar">
                        
                        <input id="current-ep" type="number" dir="rtl" 
                            min="0" maxlength="4" placeholder="####">
                        <p id="divider">/</p>
                        <p id="total-ep">####</p>
                        
                        <div class = "meter"></div>
            </div>
            <div class="ratings">
                <div class="star-bg">
                    <div class="star-darkgray"></div>
                    <div class="star-yellow"></div>
                    <img src="img/starframe.png">
                </div>
                <div class="number-bg">
                    <input id="rating" type="number" placeholder="#.#"
                                min="0.0" max="5.0" step="0.5">
                </div>
            </div>
        </div>
    `;

    // Append element to end of list
    document.getElementById("show_list").appendChild(show_card);

}