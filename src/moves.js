export const findPiece = (pieceId, pieces) => {
    return pieces.find(item => {
        if(item)
            return item.id==pieceId
        else
            return false;
    });
};

export const calculateMoves = (piece, board, king) => {
    switch(piece.type){
        case 'rook':
            return calculateRook(piece, board, king);
        case 'knight':
            return calculateKnight(piece, board, king);
        case 'bishop':
            return calculateBishop(piece, board, king);
        case 'queen':
            return calculateQueen(piece, board, king);
        case 'king':
            return calculateKing(piece, board, king);
        case 'pawn':
            return calculatePawn(piece, board, king);
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
export const ifCheck = (king, board, row, column) => { // checks if king is already checked
    //let tempPiece = {...king};
    //board[king.row][king.column].piece = null;
    let moves = calculateDiagonalMoves({row: row, column: column, color: king.color}, [], board);
    if(moves.filter((item) => {return item.piece != null && (item.piece.type == 'bishop' || item.piece.type == 'queen');}).length > 0){
        return true;
    }
    moves = calculateStraightMoves({row: row, column: column, color: king.color}, [], board);
    if(moves.filter((item) => {return item.piece != null && (item.piece.type == 'rook' || item.piece.type == 'queen');}).length > 0){

        return true;
    }
    moves = calculateKnight({row: row, column: column, color: king.color}, board, null);
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
    //board[tempPiece.row][tempPiece.column].piece = {...tempPiece};
    return false;
};
const moveCheck = (moves, king, piece, board) => { // checks if move doesn't leave a king checked
    let legalMoves = moves.filter((move) => {
        let tempPiece = board[move.row][move.column].piece;
        board[move.row][move.column].piece = piece;
        board[piece.row][piece.column].piece = null;
        let check = ifCheck(king, board, king.row, king.column); 
        board[piece.row][piece.column].piece = piece;
        board[move.row][move.column].piece = tempPiece;
        return !check;
    });
    return legalMoves;
};

// moves calculation functions
const calculateRook = (piece, board, king) => {
    let moves = [];
    moves = calculateStraightMoves(piece, moves, board);
    moves = moveCheck(moves, king, piece, board);
    return moves;
};
const calculateKnight = (piece, board, king) => {
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
    if(king) moves = moveCheck(moves, king, piece, board);
    return moves;
}; 
const calculateBishop = (piece, board, king) => {
    let moves = [];
    moves = calculateDiagonalMoves(piece, moves, board);
    moves = moveCheck(moves, king, piece, board);
    return moves;
};  
const calculateQueen = (piece, board, king) => {
    let moves = [];
    moves = calculateStraightMoves(piece, moves, board);
    moves = calculateDiagonalMoves(piece, moves, board);
    moves = moveCheck(moves, king, piece, board);
    return moves;
}; 
const calculateKing = (piece, board, king) => {
    let moves = [];
    board[piece.row][piece.column].piece = null;
    for(let row = piece.row - 1; row <= piece.row + 1; row++){
        for(let column = piece.column - 1; column <= piece.column + 1; column++){
            if(row >= 0 && column >= 0 && row <= 7 && column <= 7 && (column != piece.column || row != piece.row)){
                if((board[row][column].piece == null || board[row][column].piece.color != piece.color) && !ifCheck(piece, board, row, column)){
                    moves.push({row: row, column: column, piece: board[row][column].piece});
                }
            }
        }
    }
    let row;
    if(piece.color == 'white') row = 7;
    else row = 0;
    if(!king.checked && !piece.moved){
        //short castle
        if(board[row][piece.column+3].piece && !board[row][piece.column+3].piece.moved && !board[row][piece.column+1].piece && !board[row][piece.column+2].piece)
            if(!ifCheck(piece, board, row, piece.column+1) && !ifCheck(piece, board, row, piece.column+2))
                moves.push({row: row, column: piece.column+2, piece: board[row][piece.column+2].piece, castle: 'short'});
        //long castle
        if(board[row][piece.column-4].piece && !board[row][piece.column-4].piece.moved && !board[row][piece.column-1].piece && !board[row][piece.column-2].piece && !board[row][piece.column-3].piece)
            if(!ifCheck(piece, board, row, piece.column-1) && !ifCheck(piece, board, row, piece.column-2) && !ifCheck(piece, board, row, piece.column-3))
                moves.push({row: row, column: piece.column-3, piece: board[row][piece.column-3].piece, castle: 'long'});
    }
    board[piece.row][piece.column].piece = piece;
    return moves;
};
const calculatePawn = (piece, board, king) => {
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
        moves.push({row: row + flag, column: column + 1, piece: board[row + flag][column + 1].piece});
    }if(column > 0 && board[row+flag][column - 1].piece != null && board[row+flag][column - 1].piece.color != piece.color){
        moves.push({row: row + flag, column: column - 1, piece: board[row + flag][column - 1].piece});
    }
    moves = moveCheck(moves, king, piece, board);
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