const startWords = ["우리말", "끝말잇기", "게임"];
const index = Math.floor(Math.random() * startWords.length);
let word = startWords[index];
let time = 30;  // 타이머를 30초로 설정
let point = 0;
let wordCount = 0;  // 입력된 단어 수를 추적

const apiKey = "419D383B04262EE0B0D3E75D713E5FD4";

const keyWord = document.querySelector(".keyWord");
const timeZone = document.querySelector(".timeZone");
const input = document.querySelector("#word");
const pointZone = document.querySelector("#point");

let timeout = null;
let start = null;
let timerInterval = null;
let timerId;

function goBack() {
    window.location.href = '../html/gameChoice.html';
}

window.onload = function() {
    startCountDown();
};

// 숫자 카운트 다운 함수
function startCountDown() {
    let count = 3;
    keyWord.innerHTML = count;

    const countInterval = setInterval(() => {
        count--;
        if (count === 0) {
            clearInterval(countInterval);
            keyWord.textContent = "Game Start!";

            setTimeout(() => {
                initGame();
            }, 1000);
        } else {
            keyWord.innerHTML = count;
        }
    }, 1000);
}

function initGame() {
    keyWord.innerHTML = word;
    pointZone.innerHTML = point;
    
    // 목소리 인식
    startSpeechRecognition();
    updateMicIcon(true);
    startTimer();
}

// 타이머 시작 함수
// function startTimer() {
//     timerInterval = setInterval(() => {
//         timeZone.textContent = time;

//         if (time <= 0) {
//             clearInterval(timerInterval);
//             endGame();
//         } else {
//             if (time <= 10) {
//                 timeZone.style.color = 'red';
//                 timeZone.style.borderColor = 'red';
//             }
//             time--;
//         }
//     }, 1000);
// }

// 타이머 업데이트 함수
function updateDisplay(time) {
    timeZone.textContent = time;

    if (time <= 0) {
        clearInterval(timerInterval);
        endGame();
    } else {
        if (time <= 10) {
            timeZone.style.color = 'red';
            timeZone.style.borderColor = 'red';
        }
        time--;
    }
}

function startTimer() {
    if (timerId) clearTimeout(timerId); // 이전 타이머가 있으면 제거
    time = 30; // 시간 초기화
    isPaused = false;
    timerId = setTimeout(tick, 1000); // 1초마다 tick 함수 실행
}


function tick() {
    if (time > 0) {
        updateDisplay(time); // 현재 시간 업데이트
        time--; // 남은 시간 1초 감소
        if (!isPaused) {
            timerId = setTimeout(tick, 1000); // 1초 후에 다시 tick 함수 실행
        }
    } else {
        endGame();
    }
}

// 타이머 일시정지 함수
function pauseTimer() {
    if (timerId) {
        clearTimeout(timerId); // 타이머 중지
        isPaused = true; // 일시정지 상태로 설정
    }
}

// 타이머 재개 함수
function resumeTimer() {
    if (isPaused) {
        isPaused = false; // 일시정지 해제
        tick(); // 타이머 다시 시작
    }
}

// // 끝났을 때 alert 창으로 결과 보여줌
function endGame() {
    input.setAttribute("disabled", true);
    // alert(`Game Over \n점수: ${point}`);
    localStorage.setItem("Wordgame", point);
    setTimeout(() => {
        window.location.href = "../php/lastWordRank.php";
    }, 1000); // 1초 후에 페이지 새로고침
}

