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
let timerInterval = null;  // 타이머 인터벌을 전역 변수로 선언

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
function startTimer() {
    timerInterval = setInterval(() => {
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
    }, 1000);
}

// 타이머 멈추는 함수
function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        console.log("타이머가 멈췄습니다.");
    }
}

// 타이머를 다시 시작하는 함수
function restartTimer(newTime) {
    stopTimer();  // 기존 타이머를 멈추고
    time = newTime;  // 시간 초기화
    startTimer();  // 타이머 다시 시작
    console.log(`타이머가 ${newTime}초로 재설정되었습니다.`);
}


// 끝났을 때 alert 창으로 결과 보여줌
function endGame() {
    input.setAttribute("disabled", true);
    // alert(`Game Over \n점수: ${point}`);
    localStorage.setItem("Wordgame", point);
    setTimeout(() => {
        window.location.href = "../php/lastWordRank.php";
    }, 1000); // 1초 후에 페이지 새로고침
}

