const icon = document.getElementById('questionIcon');
const questionExp = document.getElementById('questionExp');
const gameDescription = document.getElementById('gameDescription');
const currentUrl = window.location.href; // 현재 URL을 변수에 저장

icon.addEventListener('mouseover', () => {
    // if (currentUrl.includes("index.html")) { 
    //    icon.src = './img/mic.gif';
    // }else {
    //    icon.src = '../img/mic.gif'; 
    // }
    questionExp.style.display = 'block'; // 말풍선 표시
});

icon.addEventListener('mouseout', () => {
    // if (currentUrl.includes("index.html")) { 
    //     icon.src = './img/mic.gif';
    // }else {
    //     icon.src = '../img/mic.gif';
    // }
    
    questionExp.style.display = 'none'; // 말풍선 숨김
});

questionExp.addEventListener('mouseover', () => {
    questionExp.style.display = 'block'; // 말풍선 표시
});

questionExp.addEventListener('mouseout', () => {
    questionExp.style.display = 'none'; // 말풍선 숨김
});