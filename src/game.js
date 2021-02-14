import {createBoard} from './board.js';
import {createPieces} from './pieces.js';
import {findPiece, calculateMoves, highlightMoves, unhighlightMoves, ifCheck} from './moves.js';


let board;
let boardElement;
let pieces;
let kings;
let moveColor = 'white';
let squareChecked = false;
let currentSquare;
let moves;
let moveHistory = [];
let checkMateElement;
let checkMateTextElement;

export const initGame = () => { 
    document.body.style.display = 'flex';
    boardElement = document.createElement('table');
    boardElement.id = 'board';
    board = createBoard(boardElement);
    document.body.appendChild(boardElement);
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    [pieces, board] = createPieces(board);
    board[7][4].piece.checked = false;
    board[0][4].piece.checked = false;
    kings = {white: board[7][4].piece, black: board[0][4].piece};
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

export const createSquareListener = (element) => {
    element.addEventListener('click', onSquareClick(element));
};

const onSquareClick = (element) => {
    return (event) => {
        if(event.target.localName == 'div') return ;
        let piece;
        if(squareChecked){
            piece = findPiece(currentSquare.firstElementChild.id, pieces);
        }
        else if(event.target.localName == 'img'){ 
            piece = findPiece(event.target.id, pieces);
        }
        if(event.target.localName == 'img' && (element == currentSquare || !currentSquare)){    
            // unselecting a chess piece
            if(squareChecked){  
                squareUncheck(element);
            }else{  
                // selecting a chess piece
                if(piece.color == moveColor){  
                    element.classList.add('selectedSquare');
                    element.classList.add('highlighted');
                    squareChecked = true;
                    currentSquare = element;
                    let king;
                    if(moveColor == 'white') king = kings.white;
                    else king = kings.black; 
                    moves = calculateMoves(piece, board, king);
                    highlightMoves(moves, board);
                } 
            }   
        }else{  
            // moving selected chess piece
            if(squareChecked && moves && element.classList.contains('highlighted')){    
                board[piece.row][piece.column].piece = null;
                // showing border around checked king
                if(piece.type == 'king') board[piece.row][piece.column].element.classList.remove('checkedKing');                  
                else{
                    board[kings.black.row][kings.black.column].element.classList.remove('checkedKing');
                    board[kings.white.row][kings.white.column].element.classList.remove('checkedKing');
                }
                // ---
                moveHistory.push({from: {row: piece.row, column: piece.column}, to: {row: 8-element.dataset.row, column: element.dataset.column-1}});
                if(moveHistory.length > 1) removeLastMove(moveHistory, board);
                if(moveHistory.length > 0) addLastMove(moveHistory, board);
                piece.row = 8-element.dataset.row;
                piece.column = element.dataset.column-1;
                if(board[piece.row][piece.column].piece != null) {
                    let oldPieceIndex = pieces.findIndex(item => item==board[piece.row][piece.column].piece);
                    pieces[oldPieceIndex] = null;
                    board[piece.row][piece.column].element.removeChild(board[piece.row][piece.column].piece.element);
                }
                board[piece.row][piece.column].piece = piece;
                currentSquare.removeChild(currentSquare.firstElementChild);
                element.appendChild(piece.element);
                if(!piece.moved) piece.moved = true;
                squareUncheck(currentSquare);
                if(moveColor == 'white') moveColor = 'black';
                else moveColor = 'white';
                // showing border around checked king
                if(ifCheck(kings.white, board, kings.white.row, kings.white.column)) kings.white.checked = true;
                else kings.white.checked = false;
                if(ifCheck(kings.black, board, kings.black.row, kings.black.column)) kings.black.checked = true;
                else kings.black.checked = false;
                if(kings.black.checked) board[kings.black.row][kings.black.column].element.classList.add('checkedKing');
                if(kings.white.checked) board[kings.white.row][kings.white.column].element.classList.add('checkedKing');
                // ---
                let king;
                if(moveColor == 'white') king = kings.white;
                else king = kings.black;
                if(king.checked && checkIfCheckMate(king)) checkMateActions();
            }
        }
    }
};

const checkIfCheckMate = (king) => {
    let moves = [];
    let ifMate = true;
    pieces.forEach((piece) => {
        if(piece && piece.color == moveColor){
            moves = calculateMoves(piece, board, king);
            if(moves.length > 0) ifMate = false;
        }
    });
    return ifMate;
};
const checkMateActions = () => {
    checkMateElement = document.createElement('div');
    checkMateElement.classList.add('checkMateBackground');
    checkMateTextElement = document.createElement('p');
    checkMateTextElement.classList.add('checkMateText');
    checkMateTextElement.textContent = 'Check Mate';
    checkMateTextElement.style.margin = '0px';
    console.log(checkMateTextElement.clientWidth/2);    // to fix
    checkMateTextElement.style.marginLeft = `-${checkMateTextElement.clientWidth/2}px`;
    checkMateTextElement.style.marginTop = `-${checkMateTextElement.clientHeight/2}px`;
    checkMateElement.appendChild(checkMateTextElement);
    document.body.appendChild(checkMateElement);
    console.log('check mate');
};

const removeLastMove = (moveHistory, board) => {
    let row = moveHistory[moveHistory.length - 2].from.row;
    let column = moveHistory[moveHistory.length - 2].from.column;
    board[row][column].element.classList.remove('lastMove');
    row = moveHistory[moveHistory.length - 2].to.row;
    column = moveHistory[moveHistory.length - 2].to.column;
    board[row][column].element.classList.remove('lastMove');
};
const addLastMove = (moveHistory, board) => {
    let row = moveHistory[moveHistory.length - 1].from.row;
    let column = moveHistory[moveHistory.length - 1].from.column;
    board[row][column].element.classList.add('lastMove');
    row = moveHistory[moveHistory.length - 1].to.row;
    column = moveHistory[moveHistory.length - 1].to.column;
    board[row][column].element.classList.add('lastMove');
};
const squareUncheck = (element) => {
    element.classList.remove('selectedSquare');
    element.classList.remove('highlighted');
    squareChecked = false;
    currentSquare = undefined;
    unhighlightMoves(moves, board);
    moves = [];
};