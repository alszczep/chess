const innerRowTypes = ['rook', 'knight', 'bishop', 'queen' , 'king' , 'bishop', 'knight', 'rook'];
const outerRowTypes = new Array(8).fill('pawn');
let pieces = new Array();
export const createPieces = (board) => {
    createPiecesRow(innerRowTypes, 'black', 8, board);
    createPiecesRow(outerRowTypes, 'black', 7, board);
    createPiecesRow(outerRowTypes, 'white', 2, board);
    createPiecesRow(innerRowTypes, 'white', 1, board);
    return [pieces, board];
};
const createPiece = (type, color, id) => {
    let pieceElement = document.createElement('img');
    pieceElement.classList.add('pieceImg');
    pieceElement.src = `./../img/pieces/large/${color}/${type}.png`;
    pieceElement.id = id;
    return {element: pieceElement, color: color, type: type, id: id};
};
const createPiecesRow = (types, color, rowIndex, board) => {
    const row = document.querySelectorAll(`[data-row*="${rowIndex}"]`);
    row.forEach((square, index) => {
        let piece = createPiece(types[index], color, `${color}_${types[index]}_${types[index] == 'pawn'? index+1 : (index>4 ? 2 : 1)}`);
        square.appendChild(piece.element);
        board[square.dataset.row-1][square.dataset.column-1].piece = piece;
        pieces.push(piece);
    });
}
