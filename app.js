import {initMenu} from './src/menu.js';
import {createBoard} from './src/board.js';
import {createPieces} from './src/pieces.js';


let board;
let boardElement;
let pieces;

const initGame = () => { 
    document.body.style.display = 'flex';
    boardElement = document.createElement('table');
    boardElement.id = 'board';
    board = createBoard(boardElement);
    document.body.appendChild(boardElement);
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    pieces = createPieces();
};

const resizeBoard = () => {  
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

initMenu(initGame);

// piece{element, color, type, id}  
//      MAYBE INVERT PIECES COLORS USING CSS FILTERS


// functions
const highlightMoves = (action) => {

};

const calculateMoves = (type, position, board) => {
    // returns array of moves (squares), move as an object? {row: x, column: y}
};


