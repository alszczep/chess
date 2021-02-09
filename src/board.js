import {letters} from './constants.js'
import {createSettingsButton} from './settings.js';
import {createSquareListener} from './game.js'

export const createBoard = (boardElement) => {
    let board = [];
    let colorWhite = true;
    let squareChecked = false;
    for(let indexRow = 0; indexRow < 8; indexRow++){      // creating a board, assigning elements to board array
        let boardRow = [];
        if(indexRow == 0){
            boardElement.appendChild(createNotationRow());
        }
        let tableRow = document.createElement('tr');
        tableRow.appendChild(createLeftNotationBox(8-indexRow));
        if(indexRow%2 == 0)
            colorWhite = true;
        else
            colorWhite = false;
        for(let indexColumn = 0; indexColumn < 8; indexColumn++){
            let squareClass;
            if(colorWhite){
                squareClass = 'whiteSquare';
                colorWhite = false;
            }else{
                squareClass = 'blackSquare';
                colorWhite = true;
            } 
            boardRow.push(createSquare(squareClass, 8-indexRow, indexColumn+1));     
            tableRow.appendChild(boardRow[indexColumn].element);
        }
        board.push(boardRow);
        tableRow.appendChild(createLeftNotationBox(8-indexRow));
        tableRow.classList.add('boardRow');
        boardElement.appendChild(tableRow);
        if(indexRow == 7){
            boardElement.appendChild(createNotationRow());
        }
    }
    createSettingsButton(boardElement);
    return board;
};

//functions for creating board elements
const createSquare = (squareClass, row, column) => {
    let square = document.createElement('td');
    square.classList.add(squareClass);
    square.dataset.row = row;
    square.dataset.column = column;
    square.id = `${row}${column}`
    createSquareListener(square);
    return {element: square, row: row, column: column, piece: null};
};
const createLeftNotationBox = (number) => {
    let notationBox = document.createElement('td');
    notationBox.classList.add('leftNotationBox');
    let textNode = document.createTextNode(number);
    notationBox.appendChild(textNode);
    return notationBox;
};
const createNotationRow = () => {
    let tableRow = document.createElement('tr');
    tableRow.classList.add('notationRow');
    let cornerBox = document.createElement('td');
    cornerBox.classList.add('cornerNotationBox');
    tableRow.appendChild(cornerBox);
    for(let i = 0; i < 8; i++){
        let notationBox = document.createElement('td');
        notationBox.classList.add('topNotationBox');
        let textNode = document.createTextNode(letters[i]);
        notationBox.appendChild(textNode);
        tableRow.appendChild(notationBox);
    }
    cornerBox = document.createElement('td');
    cornerBox.classList.add('cornerNotationBox');
    tableRow.appendChild(cornerBox);
    return tableRow;
};
