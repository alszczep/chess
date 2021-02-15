export const initMenu = (initGame) => {
    const startButton = document.querySelector('#startbutton');
    const howButton = document.querySelector('#howbutton');
    const howModal = document.querySelector('.modal');
    const closeHow = document.querySelector('.closeButton');
    howButton.addEventListener('click', () => {
        howModal.style.display = "block";
        startButton.style.display = "none";
        howButton.style.display = "none";
    });
    closeHow.addEventListener('click', () => {
        howModal.style.display = "none";
        startButton.style.display = "block";
        howButton.style.display = "block";
    });
    startButton.addEventListener('click', () => {
        howButton.parentNode.removeChild(howButton);
        howModal.parentNode.removeChild(howModal);
        startButton.parentNode.removeChild(startButton);
        initGame();
    });
};

