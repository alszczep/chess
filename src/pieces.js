const innerRowTypes = ['rook', 'knight', 'bishop', 'queen' , 'king' , 'bishop', 'knight', 'rook'];
const outerRowTypes = ['pawn'];
let pieces = new Array();
export const createPieces = (board, pieceImageResolution) => {
    createPiecesRow(innerRowTypes, 'black', 8, board, pieceImageResolution);
    createPiecesRow(outerRowTypes, 'black', 7, board, pieceImageResolution);
    createPiecesRow(outerRowTypes, 'white', 2, board, pieceImageResolution);
    createPiecesRow(innerRowTypes, 'white', 1, board, pieceImageResolution);
    return [pieces, board];
};
const createPiece = (type, color, id, row, column, pieceImageResolution) => {
    let pieceElement = document.createElement('img');
    pieceElement.classList.add('pieceImg');
    pieceElement.src = `./../img/pieces/${pieceImageResolution}/${color}/${type}.png`;
    pieceElement.id = id;
    return {element: pieceElement, color: color, type: type, id: id, moved: false, row: parseInt(8-row), column: parseInt(column-1)};
};
const createPiecesRow = (types, color, rowIndex, board, pieceImageResolution) => {
    const row = document.querySelectorAll(`[data-row*="${rowIndex}"]`);
    row.forEach((square, index) => {
        let piece = createPiece(types[types.length > 1 ? index : 0], color, `${color}_${types[types.length > 1 ? index : 0]}_${types[types.length > 1 ? index : 0] == 'pawn'? index+1 : (index>4 ? 2 : 1)}`, square.dataset.row, square.dataset.column, pieceImageResolution);
        square.appendChild(piece.element);
        board[8-square.dataset.row][square.dataset.column-1].piece = piece;
        pieces.push(piece);
    });
}
