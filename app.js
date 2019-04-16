/* DOM ELEMENTS */
const options = [...document.querySelectorAll('.option')];
const optionsColors = options.map(opt => opt.dataset.color);
const guesses = [...document.querySelectorAll('.guess')];
const hints = [...document.querySelectorAll('.guess-hints')]
const undo = document.querySelector('.undo');

/* STATE KEEPING THE CURRENT DATA */
let state = {};

const getCurrent = query => { 
    const row = query[query.length - state.row];
    const holes = [...row.children];
    const colors = holes.map(hole => hole.dataset.color);
    const allSelected = holes.filter(hole => hole.dataset.color);
    const lastPicked = allSelected[allSelected.length - 1];

    return [row, holes, colors, lastPicked];
}

const insertGuess = e => {
    const optionColor = e.target.dataset.color; // check which option(color) was chosen
    const [, holes, colors] = getCurrent(guesses);

    if(!isAlreadyChosen(colors, optionColor)){ //check if color was already chosen in a row previously

        holes[state.currentHole].classList.add(optionColor);//Add a chosen color as peg 
        holes[state.currentHole].dataset.color = optionColor; //set data color
        incrementHoles(); //move to the next hole
    } 

}

const removeGuess = () => {    
    if(state.currentHole > 0 ) { //only execute when curr hole is not empty

        const [,,,lastPicked] = getCurrent(guesses);

        lastPicked.classList.remove(lastPicked.dataset.color); //remove class from the last peg
        delete lastPicked.dataset.color; //remove dataset from the last peg
        state.currentHole--; //decrement curr hole 
    }
}

const incrementHoles = () => {
    if(state.currentHole < 3) {
       state.currentHole++; //move to the next hole
    } else {
        incrementRows(); //if all 4 holes are set, increment row
    }
}

const incrementRows = () => {
    const [,, guess] = getCurrent(guesses);

    if(state.row < 8) { // 8 chances (rows) for guessing the code

        checkCode(guess); //check guess, compare with code

        state.row++;  // move to the next row
        state.currentHole = 0; //reset holes 

    } else { // if did not guess after 8 rounds
        state.win = false; // set win to false
        popup(); //display popup message
    }
}

const createCode = () => {
    let code = [];
    let randomizedArray = shuffle(optionsColors); //randomize colors

   for(let i=0; i < 4; i++) {
    code.push(randomizedArray[i]); //take 4 colors as a code
   } 

   return code;
}

const checkCode = guess => {
    let hints = [];

    guess.forEach(peg => {        
        if(state.code.includes(peg)) { //if code includes peg then execute
            const indexGuess = guess.indexOf(peg); 
            const indexCode = state.code.indexOf(peg) 
            indexGuess === indexCode ? hints.push('black') : hints.push('white'); //if the same index (same place of peg) then show black hint, if not same index, show white
        }
    });

    hints = hints.sort(); // sort so first goes blacks then whites nevertheless the queue

    didWin(hints);//check if player has won

    populateHints(hints); //display hints on board
}

const populateHints = array => {

    const [, holes] = getCurrent(hints);
    const numOfHints = array.length; // number of hints received eg.: 2 white, 1 black

    for(let i=0; i < numOfHints; i++) {
        holes[i].classList.add(array[i]); //displaying hints for user
    }
}

const didWin = hints => {
    if(hints.every(hint => hint === 'black')) { //if every hint is black meaning correct pegs on correct places
        state.win = true; //set win as true
        popup(); //display message popup
    }
}

const popup = () => {
    const markup = `
        <div class="popup ${state.win === true ? 'win' : 'lose'}">
            <div class="popup__content">
                <h2>${state.win === true ? 'You won!' : 'You lose!'}</h2>
                <p>The code was:</p>
                <div class="secret-code guess">
                    <div class="hole ${state.code[0]}"></div>
                    <div class="hole ${state.code[1]}"></div>
                    <div class="hole ${state.code[2]}"></div>
                    <div class="hole ${state.code[3]}"></div>
                </div>
                <button>Try again!</button>
            </div>
        </div>
    `;

    document.querySelector('body').insertAdjacentHTML('beforeend', markup); //insert popup to html
    
}

const initGame = () => {
    state = {  //set starting values
        row: 1,
        currentHole: 0,
        code: createCode(),
        win: ''
    }

}

const restartGame = e => {
    if(e.target.closest('button')) {
        window.location.reload();
    }
}

/* ************** */

const isAlreadyChosen = (array, color) => {
    return array.some(el => el === color);
}

const shuffle = array => { //Fisher-Yates Shuffle 
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }

    return array;
}


/* LISTENERS */
options.forEach(option => option.addEventListener('click', insertGuess));
undo.addEventListener('click', removeGuess);

document.querySelector('body').addEventListener('click', restartGame);

/* INIT GAME */

initGame();
