import {resizeBoard} from './game.js'

const pieceTypes = ['queen', 'rook', 'knight', 'bishop'];

export const showPromotionWindow = (piece, boardElement, pieces, board) => {
    let promotionWindowElement = document.createElement('div');
    promotionWindowElement.classList.add('modal');
    promotionWindowElement.style.display = 'flex';
    promotionWindowElement.style.flexDirection = 'column';     
    promotionWindowElement.style.justifyContent = 'center';
    let promotionBoxes = document.createElement('div');
    promotionBoxes.classList.add('promotionBoxes');
    let promotionHeader = document.createElement('h1');
    promotionHeader.classList.add('promotionHeader');
    promotionHeader.textContent = 'Pawn promotion';
    pieceTypes.forEach((item) => {
        promotionBoxes.appendChild(createPieceBox(piece, boardElement, pieces, board, promotionWindowElement, item));
    });
    promotionWindowElement.appendChild(promotionHeader);
    promotionWindowElement.appendChild(promotionBoxes);
    document.body.appendChild(promotionWindowElement);
    boardElement.style.display = 'none';
};

const createPieceBox = (piece, boardElement, pieces, board, promotionWindowElement, pieceType) => {
    let pieceBox = document.createElement('div');
    pieceBox.classList.add('promotionBox');
    let pieceImg = document.createElement('img');
    pieceImg.classList.add('promotionImg');
    pieceImg.src = `./../img/pieces/large/black/${pieceType}.png`;
    pieceBox.appendChild(pieceImg);
    pieceBox.addEventListener('click', () => {
        let pieceIndex = pieces.findIndex(item => item==piece);
        piece.type = pieceType;
        piece.element.src = `./../img/pieces/large/${piece.color}/${piece.type}.png`;
        board[piece.row][piece.column].piece = piece;
        pieces[pieceIndex] = piece;
        document.body.removeChild(promotionWindowElement);
        boardElement.style.display = 'inline-block';
        resizeBoard();
    });  
    return pieceBox;
};