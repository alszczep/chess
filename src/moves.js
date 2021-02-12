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
export const ifCheck = (king, board, row, column) => {
    board[king.row][king.column].piece = null;
    let moves = calculateDiagonalMoves({row: row, column: column, color: king.color}, [], board);
    if(moves.filter((item) => {return item.piece != null && (item.piece.type == 'bishop' || item.piece.type == 'queen');}).length > 0){
        return true;
    }
    moves = calculateStraightMoves({row: row, column: column, color: king.color}, [], board);
    if(moves.filter((item) => {return item.piece != null && (item.piece.type == 'rook' || item.piece.type == 'queen');}).length > 0){

        return true;
    }
    moves = calculateKnight({row: row, column: column, color: king.color}, board);
    if(moves.filter((item) => {return item.piece != null && item.piece.type == 'knight';}).length > 0){
        return true;
    }
    let flag = calculateFlag(king.color);
    if(row + flag >= 0 && row + flag <= 7){
        if(column >= 1){
            if(board[row + flag][column - 1].piece != null && board[row + flag][column - 1].piece.type == 'pawn' && board[row + flag][column - 1].piece.color != king.color){
                return true;
            }
        }
        if(column <= 6){
            if(board[row + flag][column + 1].piece != null && board[row + flag][column + 1].piece.type == 'pawn' && board[row + flag][column + 1].piece.color != king.color){
                return true;
            }
        }
    }
    
    return false;
};

// moves calculation functions
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
                if((board[row][column].piece == null || board[row][column].piece.color != piece.color) && !ifCheck(piece, board, row, column)){
                    board[piece.row][piece.column].piece = piece;
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

// auxiliary moves calculation functions
const calculateKnightHorizontal = (color, row, column, board, moves) => {
    if(column >= 0 && column <= 7){   
        if(row >= 0 && row <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column, piece: board[row][column].piece});
            }
        }
        row -= 2;
        if(row >= 0 && row <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column, piece: board[row][column].piece});
            }
        }
    }
    return moves;
};
const calculateKnightVertical = (color, row, column, board, moves) => {
    if(row >= 0 && row <= 7){
        if(column >= 0 && column <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column, piece: board[row][column].piece});
            }
        }
        column -= 2;
        if(column >= 0 && column <= 7){
            if(board[row][column].piece == null || board[row][column].piece.color != color){
                moves.push({row: row, column: column, piece: board[row][column].piece});
            }
        }
    }    
    return moves;
};

const calculateDiagonalMoves = (piece, moves, board) => {
    // northeast
    let row = piece.row - 1;
    let column = piece.column + 1;
    let loop = true;
    while(row >= 0 && column <= 7 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row--;
        column++;
    }   
    // southeast
    row = piece.row + 1;
    column = piece.column + 1;
    loop = true;
    while(row <= 7 && column <= 7 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row++;
        column++;
    }   
    // southwest
    row = piece.row + 1;
    column = piece.column - 1;
    loop = true;
    while(row <= 7 && column >= 0 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row++;
        column--;
    }   
    // northwest
    row = piece.row - 1;
    column = piece.column - 1;
    loop = true;
    while(row >= 0 && column >= 0 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row--;
        column--;
    }   
    return moves;
};
const calculateStraightMoves = (piece, moves, board) => {
    // north
    let row = piece.row - 1;
    let column = piece.column;
    let loop = true;
    while(row >= 0 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row--;
    }   
    // east
    row = piece.row;
    column = piece.column + 1;
    loop = true;
    while(column <= 7 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        column++;
    }   
    // south
    row = piece.row + 1;
    column = piece.column;
    loop = true;
    while(row <= 7 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        row++;
    }   
    // west
    row = piece.row;
    column = piece.column - 1;
    loop = true;
    while(column >= 0 && loop) {       
        [moves, loop] = calculateSingleLine(piece.color, row, column, moves, board, loop);
        column--;
    }   
    return moves;
};
const calculateSingleLine = (color, row, column, moves, board, loop) => {
    if(board[row][column].piece != null){
        if(board[row][column].piece.color == color){
            loop = false;
        }else{
            moves.push({row: row, column: column, piece: board[row][column].piece});
            loop = false;
        }
    }else{
        moves.push({row: row, column: column, piece: null});
    }
    return [moves, loop];
};

const calculateFlag = (color) => {
    if(color == 'white'){
        return -1;
    }else{
        return 1;
    }
};