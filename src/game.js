import {createBoard} from './board.js';
import {createPieces} from './pieces.js';
import {findPiece, calculateMoves} from './moves.js';


let board;
let boardElement;
let pieces;
let moveColor = 'white';
let squareChecked = false;
let currentSquare;

export const initGame = () => { 
    document.body.style.display = 'flex';
    boardElement = document.createElement('table');
    boardElement.id = 'board';
    board = createBoard(boardElement);
    document.body.appendChild(boardElement);
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    [pieces, board] = createPieces(board);
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

export const createSquareListener = (element) => { // 
    element.addEventListener('click', (event) => {
        let piece = findPiece(event.target.id, pieces);
        if(event.target.localName == 'img' && (element == currentSquare || !currentSquare)){
            if(squareChecked){
                element.classList.remove('selectedSquare');
                element.classList.remove('highlighted');
                squareChecked = false;
                currentSquare = undefined;
            }else{
                if(piece.color == moveColor){
                    element.classList.add('selectedSquare');
                    element.classList.add('highlighted');
                    squareChecked = true;
                    currentSquare = element;
                    calculateMoves(piece, board);
                } 
            }   
        }
    });
};

const highlightMoves = (action) => {

};
