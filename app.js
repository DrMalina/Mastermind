const options = [...document.querySelectorAll('.option')];
const guesses = [...document.querySelectorAll('.guess')];
const undo = document.querySelector('.undo');


let state = {
    row: 1,
    currentHole: 0
};

function insertGuess(e) {
    const optionColor = e.target.dataset.color; // check which option was chosen
    const currentRow = guesses[guesses.length - state.row]; // curr row
    const currentHoles = [...currentRow.children]; // all holes in curr row

    if(!isAlreadyChosen(currentHoles, optionColor)){ //check if color was already chosen in a row

        //Add a chosen color as peg 
        currentHoles[state.currentHole].classList.add(optionColor);
        currentHoles[state.currentHole].dataset.color = optionColor;
        incrementHoles(); //move to the next hole
        //console.log(state);
    } 
}

function removeGuess() {
    const currentRow = guesses[guesses.length - state.row]; // curr row
    const currentHoles = [...currentRow.children].filter(hole => hole.dataset.color); // all holes in curr row selected by player already
    const lastPickedColor = currentHoles[currentHoles.length - 1].dataset.color;

    currentHoles[currentHoles.length - 1].classList.remove(lastPickedColor);

    console.log(lastPicked);
}

function isAlreadyChosen(holes, color) {
    return holes.some(hole => hole.classList.contains(color));
}

function incrementHoles() {
    if(state.currentHole < 3) {
       state.currentHole++;
    } else {
        incrementRows();
    }
}

function incrementRows() {
    if(state.row < 8) {
        state.row++;
        state.currentHole = 0;
    } else {
        console.log('YOU LOSE!')
        //DO WHEN LOSING
    }
}

/* LISTENERS */
options.forEach(option => option.addEventListener('click', insertGuess));
undo.addEventListener('click', removeGuess);
