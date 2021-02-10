export const createSettingsButton = (boardElement) => {
    let settingsButton = document.createElement('img');     // settings button to be made
    settingsButton.alt = 'set';
    settingsButton.src = '/img/settings_button.png'; 
    boardElement.querySelectorAll('.cornerNotationBox')[1].appendChild(settingsButton);
}