import {letters} from './board.js';
import {resizeBoard} from './game.js'

let settingsModalElement;
let moveHistoryModalElement;
export const createSettingsButton = (boardElement, moveHistory) => {
    let settingsButton = document.createElement('img');     // settings button to be made
    settingsButton.alt = 'set';
    settingsButton.src = '/img/settings_button.png'; 
    settingsButton.classList.add('settingsButton');
    createSettingsModal(boardElement, moveHistory);
    settingsButton.addEventListener('click', showSettingsModal(boardElement));
    boardElement.querySelectorAll('.cornerNotationBox')[1].appendChild(settingsButton);
}

const createSettingsModal = (boardElement, moveHistory) => {
    createMoveHistoryModal();
    settingsModalElement = document.createElement('div');
    let settingsCloseButton = document.createElement('input');
    let settingsHeader = document.createElement('p');
    let moveHistoryButton = document.createElement('button');
    settingsModalElement.classList.add('modal');
    settingsHeader.textContent = 'Settings';
    settingsHeader.classList.add('header');
    settingsHeader.classList.add('settingsHeader');
    settingsCloseButton.classList.add('closeButton');
    settingsCloseButton.type = 'button';
    settingsCloseButton.addEventListener('click', hideSettingsModal(boardElement));
    moveHistoryButton.textContent = 'Move history';
    moveHistoryButton.classList.add('moveHistoryButton');
    moveHistoryButton.addEventListener('click', showMoveHistoryModal(moveHistory));
    settingsModalElement.appendChild(settingsHeader);
    settingsModalElement.appendChild(settingsCloseButton);   
    settingsModalElement.appendChild(moveHistoryButton);
    document.body.appendChild(settingsModalElement);
};

const createMoveHistoryModal = () => {
    moveHistoryModalElement = document.createElement('div');
    moveHistoryModalElement.classList.add('modal');
    let closeMoveModalButton = document.createElement('input');
    let moveHistoryHeader = document.createElement('p');
    let moveHistoryTextArea = document.createElement('textarea');
    moveHistoryHeader.textContent = 'Move history';
    moveHistoryHeader.classList.add('header');
    moveHistoryHeader.classList.add('settingsHeader');
    closeMoveModalButton.classList.add('closeButton');
    closeMoveModalButton.type = 'button';
    closeMoveModalButton.addEventListener('click', hideMoveHistoryModal);
    moveHistoryTextArea.classList.add('moveHistoryTextArea');
    moveHistoryTextArea.readOnly = true;
    moveHistoryModalElement.appendChild(moveHistoryHeader);
    moveHistoryModalElement.appendChild(closeMoveModalButton);
    moveHistoryModalElement.appendChild(moveHistoryTextArea);
    document.body.appendChild(moveHistoryModalElement);
};
const showMoveHistoryModal = (moveHistory) => {
    return () => {
        convertMoveHistory(moveHistory, moveHistoryModalElement.querySelector('textarea'));
        settingsModalElement.style.display = 'none';
        moveHistoryModalElement.style.display = 'flex';
    }
};
const hideMoveHistoryModal = () => {
    moveHistoryModalElement.querySelector('textarea').textContent = '';
    settingsModalElement.style.display = 'flex';
    moveHistoryModalElement.style.display = 'none';
};

const convertMoveHistory = (moveHistory, textArea) => {
    moveHistory.forEach((item) => {
        textArea.textContent += `${letters[item.from.column]}${8 - item.from.row} -> ${letters[item.to.column]}${8 - item.to.row}\n`;
    })
}

export const showSettingsModal = (boardElement) => {
    return () => {
        boardElement.style.display = 'none';
        settingsModalElement.style.display = 'flex';
        if(document.body.querySelector('.checkMateBackground')) document.body.querySelector('.checkMateBackground').style.display = 'none';
    };
};
const hideSettingsModal = (boardElement) => {
    return () => {
        boardElement.style.display = 'inline-block';
        settingsModalElement.style.display = 'none';
        resizeBoard();
        if(document.body.querySelector('.checkMateBackground')) document.body.querySelector('.checkMateBackground').style.display = 'initial';
    };
};