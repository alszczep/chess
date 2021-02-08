const innerRowTypes = ['rook', 'knight', 'bishop', 'queen' , 'king' , 'bishop', 'knight', 'rook'];
const outerRowTypes = new Array(8).fill('pawn');
export const createPieces = () => {
    createPiecesRow(innerRowTypes, 'black', 8);
    createPiecesRow(outerRowTypes, 'black', 7);
    createPiecesRow(outerRowTypes, 'white', 2);
    createPiecesRow(innerRowTypes, 'white', 1);
};
const createPiece = (type, color, id) => {
    let pieceElement = document.createElement('img');
    pieceElement.classList.add('pieceImg');
    pieceElement.src = `./../img/pieces/large/${color}/${type}.png`;
    pieceElement.id = id;
    return {element: pieceElement, color: color, type: type, id: id};
};
const createPiecesRow = (types, color, rowIndex, ids) => {
    const row = document.querySelectorAll(`[data-row*="${rowIndex}"]`);
    row.forEach((square, index) => {
        let piece = createPiece(types[index], color, `${color}_${types[index]}_${'pawn'? index+1 : (index>4 ? 2 : 1)}`);
        square.appendChild(piece.element);
    });
}
