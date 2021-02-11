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
export const ifCheck = (king, board) => {
    
};

const calculateRook = (piece, board) => {
    let moves = [];
    moves = calculateStraightMoves(piece, moves, board);
    return moves;
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
        if(!piece.moved && board[row+flag*2][column].piece == null){
                moves.push({row: row+flag*2, column: column});
        }
    }if(column < 7 && board[row+flag][column+1].piece != null && board[row+flag][column+1].piece.color != piece.color){
        moves.push({row: row+flag, column: column+1});
    }if(column > 0 && board[row+flag][column-1].piece != null && board[row+flag][column-1].piece.color != piece.color){
        moves.push({row: row+flag, column: column-1});
    }
    return moves;
};
const calculateDiagonalMoves = (piece, moves, board) => {
    
};

const calculateStraightMoves = (piece, moves, board) => {
    let tempRow = piece.row-1;
    let tempColumn = piece.column;
    while(tempRow >= 0) {       // north
        if(board[tempRow][tempColumn].piece != null){
            if(board[tempRow][tempColumn].piece.color == piece.color){
                break;
            }else{
                moves.push({row: tempRow, column: tempColumn});
                break;
            }
        }else{
            moves.push({row: tempRow, column: tempColumn});
        }
        tempRow--;
    }   
    tempRow = piece.row;
    tempColumn = piece.column+1;
    while(tempColumn <= 7) {       // east
        if(board[tempRow][tempColumn].piece != null){
            if(board[tempRow][tempColumn].piece.color == piece.color){
                break;
            }else{
                moves.push({row: tempRow, column: tempColumn});
                break;
            }
        }else{
            moves.push({row: tempRow, column: tempColumn});
        }
        tempColumn++;
    }   
    tempRow = piece.row+1;
    tempColumn = piece.column;
    while(tempRow <= 7) {       // south
        if(board[tempRow][tempColumn].piece != null){
            if(board[tempRow][tempColumn].piece.color == piece.color){
                break;
            }else{
                moves.push({row: tempRow, column: tempColumn});
                break;
            }
        }else{
            moves.push({row: tempRow, column: tempColumn});
        }
        tempRow++;
    }   
    tempRow = piece.row;
    tempColumn = piece.column-1;
    while(tempColumn >= 0) {       // west
        if(board[tempRow][tempColumn].piece != null){
            if(board[tempRow][tempColumn].piece.color == piece.color){
                break;
            }else{
                moves.push({row: tempRow, column: tempColumn});
                break;
            }
        }else{
            moves.push({row: tempRow, column: tempColumn});
        }
        tempColumn--;
    }   
    return moves;
};

const calculateFlag = (color) => {
    if(color == 'white'){
        return -1;
    }else{
        return 1;
    }
};