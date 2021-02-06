// MENU
// variables
const startButton = document.querySelector('#startbutton');
const howButton = document.querySelector('#howbutton');
const howModal = document.querySelector('#howmodal');
const closeHow = document.querySelector('#closehow');

// functions
howButton.addEventListener('click', () => {
    howModal.style.display = "initial";
});
closeHow.addEventListener('click', () => {
    howModal.style.display = "none";
});
startButton.addEventListener('click', () => {   // clears DOM, starts game
    howButton.parentNode.removeChild(howButton);
    howModal.parentNode.removeChild(howModal);
    startButton.parentNode.removeChild(startButton);
    initGame();
});

// GAME
const initGame = () => {    // remember to define important variables outside of this function

};
// variables
let squareChecked = false;
// functions
const createListener = (elem) => {
    elem.addEventListener('click', () => {
        // if a chess piece is standing on this square, show it's moves
        // if another square has been already clicked (squareChecked), move chess piece to this square if a move is legal
    });
};

const createBoard = () => {
    // board built of table cells, chess pieces are images
};

const resizeBoard = () => {     //horizontal to vertical, vertical to horizontal ??

};
