import {createBoard} from './board.js';
import {createPieces} from './pieces.js';
import {findPiece, calculateMoves, highlightMoves, unhighlightMoves} from './moves.js';


let board;
let boardElement;
let pieces;
let moveColor = 'white';
let squareChecked = false;
let currentSquare;
let moves;
let moveHistory = [];

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
        let piece;
        if(squareChecked){
            piece = findPiece(currentSquare.firstElementChild.id, pieces);
        }
        else if(event.target.localName == 'img'){ 
            piece = findPiece(event.target.id, pieces);
        }
        if(event.target.localName == 'img' && (element == currentSquare || !currentSquare)){    
            if(squareChecked){  // unselecting a chess piece
                squareUncheck(element);
            }else{  
                if(piece.color == moveColor){   // selecting a chess piece
                    element.classList.add('selectedSquare');
                    element.classList.add('highlighted');
                    squareChecked = true;
                    currentSquare = element;
                    moves = calculateMoves(piece, board);
                    highlightMoves(moves, board);
                } 
            }   
        }else{  
            if(squareChecked && moves && element.classList.contains('highlighted')){    // moving selected chess piece
                board[piece.row][piece.column].piece = null;
                moveHistory.push({from: {row: piece.row,column: piece.column}, to: {row: 8-element.dataset.row, column: element.dataset.column-1}});
                if(moveHistory.length > 1){
                    let row = moveHistory[moveHistory.length-2].from.row;
                    let column = moveHistory[moveHistory.length-2].from.column;
                    board[row][column].element.classList.remove('lastMove');
                    row = moveHistory[moveHistory.length-2].to.row;
                    column = moveHistory[moveHistory.length-2].to.column;
                    board[row][column].element.classList.remove('lastMove');
                }
                if(moveHistory.length > 0){
                    let row = moveHistory[moveHistory.length-1].from.row;
                    let column = moveHistory[moveHistory.length-1].from.column;
                    board[row][column].element.classList.add('lastMove');
                    row = moveHistory[moveHistory.length-1].to.row;
                    column = moveHistory[moveHistory.length-1].to.column;
                    board[row][column].element.classList.add('lastMove');
                }
                piece.row = 8-element.dataset.row;
                piece.column = element.dataset.column-1;
                if(board[piece.row][piece.column].piece != null){
                    board[piece.row][piece.column].element.removeChild(board[piece.row][piece.column].piece.element);
                    board[piece.row][piece.column].piece = null;
                }
                board[piece.row][piece.column].piece = piece;
                currentSquare.removeChild(currentSquare.firstElementChild);
                element.appendChild(piece.element);
                if(!piece.moved){
                    piece.moved = true;
                }
                squareUncheck(currentSquare);
                if(moveColor == 'white'){
                    moveColor = 'black';
                }else{
                    moveColor = 'white';
                }
            }
        }
    });
};

const squareUncheck = (element) => {
    element.classList.remove('selectedSquare');
    element.classList.remove('highlighted');
    squareChecked = false;
    currentSquare = undefined;
    unhighlightMoves(moves, board);
    moves = [];
};