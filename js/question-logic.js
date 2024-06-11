const icon = document.getElementById('questionIcon');
const questionExp = document.getElementById('questionExp');
const gameDescription = document.getElementById('gameDescription');

icon.addEventListener('mouseover', () => {
    icon.src = './img/questionIconHover.png';
    questionExp.style.display = 'block'; // 말풍선 표시
});

icon.addEventListener('mouseout', () => {
    icon.src = './img/questionIcon.png';
    questionExp.style.display = 'none'; // 말풍선 숨김
});

questionExp.addEventListener('mouseover', () => {
    questionExp.style.display = 'block'; // 말풍선 표시
});

questionExp.addEventListener('mouseout', () => {
    questionExp.style.display = 'none'; // 말풍선 숨김
});