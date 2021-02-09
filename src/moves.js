export const findPiece = (pieceId, pieces) => {
    return pieces.find(item => item.id==pieceId);
};

export const calculateMoves = (piece, board) => {
    let moves; 
    // moves.push({row: , column:});
    switch(piece.type){
        case 'rook':
            moves = calculateRook(piece, board);
            break;
        case 'knight':
            moves = calculateKnight(piece, board);
            break;
        case 'bishop':
            moves = calculateBishop(piece, board);
            break;
        case 'queen':
            moves = calculateQueen(piece, board);
            break;
        case 'king':
            moves = calculateKing(piece, board);
            break;
        case 'pawn':
            moves = calculatePawn(piece, board);
            break;
    }
    return moves;
};

const calculateRook = (piece, board) => {
    console.log(piece);
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
    
};