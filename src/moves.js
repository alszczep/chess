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

// chess pieces functions
const calculateRook = (piece, board) => {
    let moves = [];
    moves = calculateStraightMoves(piece, moves, board);
    return moves;
};
const calculateKnight = (piece, board) => {
    let moves = [];
    let row = piece.row - 2;
    let column = piece.column + 1;
    moves = calculateKnightVertical(piece.color, row, column, board, moves); // north
    row = piece.row + 1;
    column = piece.column + 2;
    moves = calculateKnightHorizontal(piece.color, row, column, board, moves); // east
    row = piece.row + 2;
    column = piece.column + 1;
    moves = calculateKnightVertical(piece.color, row, column, board, moves); // south
    row = piece.row + 1;
    column = piece.column - 2;  
    moves = calculateKnightHorizontal(piece.color, row, column, board, moves); // west
    return moves;
}; 
const calculateBishop = (piece, board) => {
    let moves = [];
    moves = calculateDiagonalMoves(piece, moves, board);
    return moves;
};  
const calculateQueen = (piece, board) => {
    let moves = [];
    moves = calculateStraightMoves(piece, moves, board);
    moves = calculateDiagonalMoves(piece, moves, board);
    return moves;
}; 
const calculateKing = (piece, board) => {
    let moves = [];
    for(let row = piece.row - 1; row <= piece.row + 1; row++){
        for(let column = piece.column - 1; column <= piece.column + 1; column++){
            if(row >= 0 && column >= 0 && row <= 7 && column <= 7 && (column != piece.column || row != piece.row)){
                if(!ifCheck(piece, board) && (board[row][column].piece == null || board[row][column].piece.color != piece.color)){
                    moves.push({row: row, column: column});
                }
            }
        }
    }
    return moves;
};
const calculatePawn = (piece, board) => {
    let moves = [];
    let flag = calculateFlag(piece.color);
    let row = piece.row;
    let column = piece.column;
    if(board[row+flag][column].piece == null){
        moves.push({row: row+flag, column: column});
        if(!piece.moved && board[row + flag * 2][column].piece == null){
                moves.push({row: row + flag * 2, column: column});
        }
    }if(column < 7 && board[row+flag][column + 1].piece != null && board[row+flag][column + 1].piece.color != piece.color){
        moves.push({row: row+flag, column: column + 1});
    }if(column > 0 && board[row+flag][column - 1].piece != null && board[row+flag][column - 1].piece.color != piece.color){
        moves.push({row: row+flag, column: column - 1});
    }
    return moves;
};

// moves calculation functions
const calculateKnightHorizontal = (color, row, column, board, moves) => {
    if(column >= 0 && column <= 7){   
        if(row >= 0 && row <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column});
            }
        }
        row -= 2;
        if(row >= 0 && row <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column});
            }
        }
    }
    return moves;
};
const calculateKnightVertical = (color, row, column, board, moves) => {
    if(row >= 0 && row <= 7){
        if(column >= 0 && column <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column});
            }
        }
        column -= 2;
        if(column >= 0 && column <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column});
            }
        }
    }    
    return moves;
};

const calculateDiagonalMoves = (piece, moves, board) => {
    let row = piece.row - 1;
    let column = piece.column + 1;
    while(row >= 0 && column <= 7) {       // northeast
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row--;
        column++;
    }   
    row = piece.row + 1;
    column = piece.column + 1;
    while(row <= 7 && column <= 7) {       // southeast
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row++;
        column++;
    }   
    row = piece.row + 1;
    column = piece.column - 1;
    while(row <= 7 && column >= 0) {       // southwest
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row++;
        column--;
    }   
    row = piece.row - 1;
    column = piece.column - 1;
    while(row >= 0 && column >= 0) {       // northwest
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row--;
        column--;
    }   
    return moves;
};

const calculateStraightMoves = (piece, moves, board) => {
    let row = piece.row - 1;
    let column = piece.column;
    while(row >= 0) {       // north
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row--;
    }   
    row = piece.row;
    column = piece.column + 1;
    while(column <= 7) {       // east
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        column++;
    }   
    row = piece.row + 1;
    column = piece.column;
    while(row <= 7) {       // south
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        row++;
    }   
    row = piece.row;
    column = piece.column - 1;
    while(column >= 0) {       // west
        if(board[row][column].piece != null){
            if(board[row][column].piece.color == piece.color){
                break;
            }else{
                moves.push({row: row, column: column});
                break;
            }
        }else{
            moves.push({row: row, column: column});
        }
        column--;
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