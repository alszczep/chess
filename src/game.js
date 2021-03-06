import {createBoard} from './board.js';
import {createPieces} from './pieces.js';
import {findPiece, calculateMoves, highlightMoves, unhighlightMoves, ifCheck} from './moves.js';
import {showPromotionWindow} from './promotion.js';
import {showSettingsModal} from './settings.js'

let board;
let boardElement;
let pieceImageResolution;
let pieces;
let kings;
let moveColor = 'white';
let squareChecked = false;
let currentSquare;
let moves;
let moveHistory = [];
let checkMateElement;
let checkMateTextElement;
let enpassant = {white: [], black: []};

// creates board and pieces, called on start button click
export const initGame = () => { 
    document.body.style.display = 'flex';
    boardElement = document.createElement('table');
    boardElement.id = 'board';
    board = createBoard(boardElement, moveHistory);
    document.body.appendChild(boardElement);
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    pieceImageResolution = calculatePieceImageResolution();
    [pieces, board] = createPieces(board, pieceImageResolution);
    board[7][4].piece.checked = false;
    board[0][4].piece.checked = false;
    kings = {white: board[7][4].piece, black: board[0][4].piece};
};

// scaling functions for board and pieces
export const resizeBoard = () => {  
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
    if(pieces){
        let tempResolution = calculatePieceImageResolution();
        if(tempResolution != pieceImageResolution){
            pieceImageResolution = tempResolution;
            updatePieceImageResolution(pieceImageResolution); 
        }
    }
};
const calculatePieceImageResolution = () => {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let size = width < height ? width : height;
    if(size >= 1200) return 'large';
    if(size >= 500) return 'medium';
    return 'small';
};
const updatePieceImageResolution = (tempResolution) => {
    pieces = pieces.map((piece) => {
        if(piece){
            piece.element.src = `./../img/pieces/${tempResolution}/${piece.color}/${piece.type}.png`;
            board[piece.row][piece.column].piece = piece;
            return piece;
        }
    });
};

// handles piece selecting and movement
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
                    // adding enpassant move
                    if(piece.type == 'pawn'){
                        if(moveColor == 'white'){
                            if(enpassant.white.length > 0){
                                enpassant.white.forEach((item) => {
                                    if(item.pawn == piece)  moves.push({row: item.move.row, column: item.move.column, piece: null});
                                });
                            }
                        }else{
                            if(enpassant.black.length > 0){
                                enpassant.black.forEach((item) => {
                                    if(item.pawn == piece)  moves.push({row: item.move.row, column: item.move.column, piece: null});
                                });
                            }
                        }
                    }
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
                // castle
                if(piece.type == 'king'){
                    let castle = moves.find((move) => {
                        return move.castle;
                    });
                    if(castle){
                        castle = castle.castle;
                        if(castle == 'short') doCastle(board, piece, -1);
                        if(castle == 'long') doCastle(board, piece, 1);
                    }
                }
                // en passant
                if(piece.type == 'pawn'){
                    let target;
                    if(moveColor == 'white'){
                        if(enpassant.white.length > 0)
                            enpassant.white.forEach((item) => {
                                if(item.pawn == piece)  {
                                    board[item.target.row][item.target.column].element.removeChild(board[item.target.row][item.target.column].piece.element);
                                    let oldPieceIndex = pieces.findIndex(oldPiece => oldPiece == board[item.target.row][item.target.column].piece);
                                    pieces[oldPieceIndex] = null;
                                    board[item.target.row][item.target.column].piece = null;
                                }
                            });
                    }else{
                        if(enpassant.black.length > 0)
                            enpassant.black.forEach((item) => {
                                if(item.pawn == piece)  {
                                    board[item.target.row][item.target.column].element.removeChild(board[item.target.row][item.target.column].piece.element);
                                    let oldPieceIndex = pieces.findIndex(oldPiece => oldPiece == board[item.target.row][item.target.column].piece);
                                    pieces[oldPieceIndex] = null;
                                    board[item.target.row][item.target.column].piece = null;
                                }
                            });                      
                    }    
                    if(piece.row == 0 || piece.row == 7) showPromotionWindow(piece, boardElement, pieces, board, pieceImageResolution);
                    if(piece.moved == false && (piece.row == 3 || piece.row == 4)) calculateEnPassant(piece);          
                }
                currentSquare.removeChild(currentSquare.firstElementChild);
                element.appendChild(piece.element);
                if(!piece.moved) piece.moved = true;
                squareUncheck(currentSquare);
                let king;
                if(moveColor == 'white'){
                    moveColor = 'black';
                    king = kings.black;
                    enpassant.white = [];
                }
                else{
                    moveColor = 'white';
                    king = kings.white;
                    enpassant.black = [];
                }
                // showing border around checked king
                if(ifCheck(kings.white, board, kings.white.row, kings.white.column)) kings.white.checked = true;
                else kings.white.checked = false;
                if(ifCheck(kings.black, board, kings.black.row, kings.black.column)) kings.black.checked = true;
                else kings.black.checked = false;
                if(kings.black.checked) board[kings.black.row][kings.black.column].element.classList.add('checkedKing');
                if(kings.white.checked) board[kings.white.row][kings.white.column].element.classList.add('checkedKing');
                // ---
                if(checkIfCheckMate(king)) checkMateActions(king.checked);

            }
        }
    }
};

// movement functions
const calculateEnPassant = (piece) => {
    let tempEnpassant = [];
    let moveRow;
    if(piece.color == 'white') moveRow = piece.row + 1;
    else moveRow = piece.row - 1;
    if(piece.column > 0 && board[piece.row][piece.column - 1].piece && board[piece.row][piece.column - 1].piece.type == 'pawn' && board[piece.row][piece.column - 1].piece.color != piece.color){
        tempEnpassant.push({pawn: board[piece.row][piece.column - 1].piece, target: piece, move: {row: moveRow, column: piece.column}});
    }
    if(piece.column < 7 && board[piece.row][piece.column + 1].piece && board[piece.row][piece.column + 1].piece.type == 'pawn' && board[piece.row][piece.column + 1].piece.color != piece.color){
        tempEnpassant.push({pawn: board[piece.row][piece.column + 1].piece, target: piece, move: {row: moveRow, column: piece.column}});
    }
    if(piece.color == 'white') enpassant.black = tempEnpassant;
    else enpassant.white = tempEnpassant;
};
const doCastle = (board, piece, flag) => {
    board[piece.row][piece.column + flag].piece = board[piece.row][piece.column - flag].piece;
    board[piece.row][piece.column - flag].piece = null;
    board[piece.row][piece.column - flag].element.removeChild(board[piece.row][piece.column + flag].piece.element);
    board[piece.row][piece.column + flag].element.appendChild(board[piece.row][piece.column + flag].piece.element);
    if(flag == 1) board[piece.row][piece.column + flag].piece.column = 2;
    else board[piece.row][piece.column + flag].piece.column = 5;
};

// check mate functions
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
const checkMateActions = (checked) => {
    checkMateElement = document.createElement('div');
    checkMateElement.classList.add('checkMateBackground');
    checkMateElement.addEventListener('click', showSettingsModal(boardElement));
    checkMateTextElement = document.createElement('p');
    checkMateTextElement.classList.add('checkMateText');
    if(checked) checkMateTextElement.textContent = 'Check Mate';
    else checkMateTextElement.textContent = 'Stalemate';
    checkMateTextElement.style.margin = '0px';
    console.log(checkMateTextElement.clientWidth/2);    // to fix
    checkMateTextElement.style.marginLeft = `-${checkMateTextElement.clientWidth/2}px`;
    checkMateTextElement.style.marginTop = `-${checkMateTextElement.clientHeight/2}px`;
    checkMateElement.appendChild(checkMateTextElement);
    document.body.appendChild(checkMateElement);
};

// move history functions
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