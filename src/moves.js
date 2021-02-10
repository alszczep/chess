export const findPiece = (pieceId, pieces) => {
    return pieces.find(item => item.id==pieceId);
};

export const calculateMoves = (piece, board) => {
    switch(piece.type){
        case 'rook':
            return calculateRook(piece, board);
        case 'knight':
            return calculateKnight(piece, board);
        case 'bishop':
            return calculateBishop(piece, board);
        case 'queen':
            return calculateQueen(piece, board);
        case 'king':
            return calculateKing(piece, board);
        case 'pawn':
            return calculatePawn(piece, board);
    }
    return [];
};
export const highlightMoves = (moves, board) => {
    if(moves){
        moves.forEach((item) => {
            board[item.row][item.column].element.classList.add('highlighted');
        });
    }
};
export const unhighlightMoves = (moves, board) => {
    if(moves){
        moves.forEach((item) => {
            board[item.row][item.column].element.classList.remove('highlighted');
        });
    }
};
//                                                                              REMEMBER ABOUT REACHING THE EDGE OF THE BOARD
const calculateRook = (piece, board) => {
    let moves = [];
};
const calculateKnight = (piece, board) => {
    
}; 
const calculateBishop = (piece, board) => {
    
};  
const calculateQueen = (piece, board) => {
    
}; 
const calculateKing = (piece, board) => {
    
};
const calculatePawn = (piece, board) => {
    let moves = [];
    let flag = calculateFlag(piece.color);
    let row = piece.row;
    let column = piece.column;
    if(board[row+flag][column].piece == null){
        moves.push({row: row+flag, column: column});
    }if(board[row+flag][column+1].piece != null && board[row+flag][column+1].piece.color != piece.color){
        moves.push({row: row+flag, column: column+1});
    }if(board[row+flag][column-1].piece != null && board[row+flag][column-1].piece.color != piece.color){
        moves.push({row: row+flag, column: column-1});
    }if(!piece.moved){
        if(board[row+flag*2][column].piece == null){
            moves.push({row: row+flag*2, column: column});
        }
    }
    return moves;
};
const calculateDiagonalMoves = () => {

};
const calculateStraightMoves = () => {

};

const calculateFlag = (color) => {
    if(color == 'white'){
        return -1;
    }else{
        return 1;
    }
};