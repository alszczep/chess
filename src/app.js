// move some functions to separate files ( like createBoard, resizeBoard)

// MENU
// variables
const startButton = document.querySelector('#startbutton');
const howButton = document.querySelector('#howbutton');
const howModal = document.querySelector('#howmodal');
const closeHow = document.querySelector('#closehow');

// functions


// GAME

//                      CREATE SOME SYSTEM TO STORE INFO ABOUT BOARD (SQUARES AND PIECES POSITIONS), classes or multidimensional array containing objects   
// piece{element, color, type, id}              square{element, row, column, piece}
//      MAYBE INVERT PIECES COLORS USING CSS FILTERS

// variables
let board = new Array(8).fill(new Array(8));
let boardElement;
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let colorWhite = true;
let squareChecked = false;

// functions
const createListener = (elem) => {
    elem.addEventListener('click', () => {
        // using event.target?
        // if a chess piece is standing on this square, show it's moves
        // if another square has been already clicked (squareChecked), move chess piece to this square if a move is legal
    });
};

const highlightMoves = (action) => {

};

const calculateMoves = (type, position, board) => {
    // returns array of moves (squares), move as an object? {row: x, column: y}
};

const createPieces = () => {
    // chess pieces are images?
};

const initGame = () => { 
    document.body.style.display = 'flex';
    boardElement = document.createElement('table');
    boardElement.id = 'board';
    board.forEach((row, indexRow) => {      // creating a board, assigning elements to board array
        if(indexRow == 0){
            boardElement.appendChild(createNotationRow());
        }
        let tableRow = document.createElement('tr');
        tableRow.appendChild(createLeftNotationBox(8-indexRow));
        if(indexRow%2 == 0)
            colorWhite = true;
        else
            colorWhite = false;
        for(let indexColumn = 0; indexColumn < 8; indexColumn++){
            let squareClass;
            if(colorWhite){
                squareClass = 'whiteSquare';
                colorWhite = false;
            }else{
                squareClass = 'blackSquare';
                colorWhite = true;
            }
            board[indexRow][indexColumn] = createSquare(squareClass, 8-indexRow, indexColumn+1);
            tableRow.appendChild(board[indexRow][indexColumn].element);
        }
        tableRow.appendChild(createLeftNotationBox(8-indexRow));
        tableRow.classList.add('boardRow');
        boardElement.appendChild(tableRow);
        if(indexRow == 7){
            boardElement.appendChild(createNotationRow());
        }
    });
    document.body.appendChild(boardElement);
    resizeBoard();
};

const resizeBoard = () => {     //horizontal to vertical, vertical to horizontal ??
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    if(width >= height){
        boardElement.classList.add('horizontal');
        boardElement.classList.remove('vertical');
    }else{
        boardElement.classList.add('vertical');
        boardElement.classList.remove('horizontal');
    }
    if(boardElement.classList.contains('horizontal')){
        boardElement.style.height = '100%';
        boardElement.style.width = `${boardElement.clientHeight}px`;
    }else{
        boardElement.style.width = '100%';
        boardElement.style.height = `${boardElement.clientWidth}px`;
    }
};

// board creation functions
const createSquare = (squareClass, row, column) => {
    let square = document.createElement('td');
    square.classList.add(squareClass);
    return {element: square, row: row, column: column, piece: null};
};
const createLeftNotationBox = (number) => {
    let notationBox = document.createElement('td');
    notationBox.classList.add('leftNotationBox');
    let textNode = document.createTextNode(number);
    notationBox.appendChild(textNode);
    return notationBox;
};
const createNotationRow = () => {
    let tableRow = document.createElement('tr');
    tableRow.classList.add('notationRow');
    let cornerBox = document.createElement('td');
    cornerBox.classList.add('cornerNotationBox');
    tableRow.appendChild(cornerBox);
    for(let i = 0; i < 8; i++){
        let notationBox = document.createElement('td');
        notationBox.classList.add('topNotationBox');
        let textNode = document.createTextNode(letters[i]);
        notationBox.appendChild(textNode);
        tableRow.appendChild(notationBox);
    }
    cornerBox = document.createElement('td');
    cornerBox.classList.add('cornerNotationBox');
    tableRow.appendChild(cornerBox);
    return tableRow;
};

// listeners
window.addEventListener('resize', resizeBoard);
howButton.addEventListener('click', () => {
    howModal.style.display = "block";
    startButton.style.display = "none";
    howButton.style.display = "none";
});
closeHow.addEventListener('click', () => {
    howModal.style.display = "none";
    startButton.style.display = "block";
    howButton.style.display = "block";
});
startButton.addEventListener('click', () => {   // clears DOM, starts game
    howButton.parentNode.removeChild(howButton);
    howModal.parentNode.removeChild(howModal);
    startButton.parentNode.removeChild(startButton);
    initGame();
});