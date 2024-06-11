const startWords = ["우리말", "끝말잇기", "게임"];
const index = Math.floor(Math.random() * startWords.length);
let word = startWords[index];
let time = 30;  // 타이머를 120초로 설정
let point = 0;
let wordCount = 0;  // 입력된 단어 수를 추적

const apiKey = "D857D92EE2FC749494BF756C5B793649";

const keyWord = document.querySelector(".keyWord");
const timeZone = document.querySelector(".timeZone");
const input = document.querySelector("#word");
const pointZone = document.querySelector("#point");

let timeout = null;
let start = null;


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
           
            timeCheck();
            setTimeout(() => {
                initGame(); // 여기서 바로 initGame()을 호출합니다.
            }, 1000); // 1초 후에 메시지 숨기기
        } else {
            keyWord.innerHTML = count;
        }
    }, 1000);
}

function initGame() {
    keyWord.innerHTML = word;
    pointZone.innerHTML = point;
    startTimer();
}

//시간
function startTimer() {
    start = setInterval(timeCheck, 1000);
}

function timeCheck() {
    timeZone.innerHTML = time;
    if (time === 0) {
        clearInterval(start);
        endGame();
    } else {
        if (time <= 10) {
            timeZone.style.color = 'red'; // 시간이 10초 이하일 때 텍스트 색상을 빨간색으로 변경
            timeZone.style.borderColor = 'red';
        }
        time -= 1;
    }
}

//끝났을때 alert창으로 결과 보여줌
function endGame() {
    input.setAttribute("disabled", true);
    // alert(`Game Over \n점수: ${point}`);
    localStorage.setItem("Wordgame", point);
    setTimeout(() => {
        window.location.href = "http://localhost/pleaseSay/php/lastWordRank.php";
    }, 1000); // 1초 후에 페이지 새로고침
}


