let settingsModalElement;
export const createSettingsButton = (boardElement) => {
    let settingsButton = document.createElement('img');     // settings button to be made
    settingsButton.alt = 'set';
    settingsButton.src = '/img/settings_button.png'; 
    settingsButton.classList.add('settingsButton');
    createSettingsModal(boardElement);
    settingsButton.addEventListener('click', showSettingsModal(boardElement));
    boardElement.querySelectorAll('.cornerNotationBox')[1].appendChild(settingsButton);
}

const createSettingsModal = (boardElement) => {
    settingsModalElement = document.createElement('div');
    let settingsCloseButton = document.createElement('input');
    let settingsHeader = document.createElement('p');
    settingsModalElement.classList.add('modal');
    settingsHeader.textContent = 'Settings';
    settingsHeader.classList.add('header');
    settingsCloseButton.classList.add('closeButton');
    settingsCloseButton.type = 'button';
    settingsCloseButton.addEventListener('click', hideSettingsModal(boardElement));
    settingsModalElement.appendChild(settingsHeader);
    settingsModalElement.appendChild(settingsCloseButton);   
    document.body.appendChild(settingsModalElement);
};

const showSettingsModal = (boardElement) => {
    return () => {
        boardElement.style.display = 'none';
        settingsModalElement.style.display = 'block';
    };
};
const hideSettingsModal = (boardElement) => {
    return () => {
        boardElement.style.display = 'inline-block';
        settingsModalElement.style.display = 'none';
    };
};