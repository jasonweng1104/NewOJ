const popupBtn = document.getElementById('popup-btn');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const popupInput = document.getElementById('popup-input');
const submitBtn = document.getElementById('submit-btn');

popupBtn.addEventListener('click', function () {
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popupInput.focus();
    document.body.style.overflow = 'hidden';
});

submitBtn.addEventListener('click', function () {
    const inputText = popupInput.value;
    overlay.style.display = 'none';
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
});
