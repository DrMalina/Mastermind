const options = [...document.querySelectorAll('.option')];
const guesses = [...document.querySelectorAll('.guess')];
const undo = document.querySelector('.undo');


let state = {
    row: 1,
    currentHole: 0
};

function insertGuess(e) {
    const optionColor = e.target.dataset.color; // check which option was chosen
    const currentGuessRow = guesses[guesses.length - state.row]; // curr row
    const currentGuessHoles = [...currentGuessRow.children]; // all holes in curr row

    if(!isAlreadyChosen(currentGuessHoles, optionColor)){ //check if color was already chosen in a row

        //Add a chosen color as peg 
        currentGuessHoles[state.currentHole].classList.add(optionColor);
        incrementHoles(); //move to the next hole
        console.log(state);
    } 
}

function removeGuess() {
    console.log('Undo');
}

function isAlreadyChosen(holes, color) {
    return holes.some(hole => hole.classList.contains(color));
}

function incrementHoles() {
    if(state.currentHole < 3) {
       state.currentHole++;
    } else {
        state.row++;
        state.currentHole = 0; 
    }
}


options.forEach(option => option.addEventListener('click', insertGuess));
undo.addEventListener('click', removeGuess);
