const startWords = ["우리말", "끝말잇기", "게임"];
const index = Math.floor(Math.random() * startWords.length);
let word = startWords[index];
let time = 30;  // 타이머를 30초로 설정
var point = 0;
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

// // 끝났을 때 
// function endGame() {
    
//     input.setAttribute("disabled", true);
//     // alert(`Game Over \n점수: ${point}`);
//     localStorage.setItem("Wordgame", point);
//     console.log(point);
    
//     var userName = localStorage.getItem("userName") || "none"; // 적절한 사용자 이름 값을 여기에 설정하세요
//     var point = localStorage.getItem("Wordgame") || null; // 적절한 점수 값을 여기에 설정하세요

//     var rankingData = localStorage.getItem('rankingData');

//     // axios 요청
//     axios.post('fetch_lastWordRank.php', {
//         userName: userName,
//         score: point
//     })
//     .then(function (response) {
//         console.log('Data sent successfully.');
//         // 여기에서 필요에 따라 추가 작업을 수행할 수 있습니다.
//     })
//     .catch(function (error) {
//         console.error('There was an error sending the data:', error);
//     });
    
//     setTimeout(() => {
//         window.location.href = "../php/lastWordRank.php";
//     }, 1000); // 1초 후에 페이지 새로고침
// }


// function endGame() {
//     input.setAttribute("disabled", true);
//     // alert(`Game Over \n점수: ${point}`);
//     localStorage.setItem("Wordgame", point);
//     setTimeout(() => {
//         window.location.href = "../php/lastWordRank.php";
//     }, 1000); // 1초 후에 페이지 새로고침
// }

// 이름 받기 함수
function getUserName() {
    var defaultUserName = "exampleUserName"; // 기본 사용자 이름 설정
    var userName = localStorage.getItem("userName") || defaultUserName;
    return userName;
}

// 서버에 데이터 전송 함수
async function sendDataToServer(userName, point) {
    try {
        const response = await axios.post('http://localhost/pleaseSay/php/fetch_lastWordRank.php', {
            userName: userName,
            score: point
        });

        console.log('Data sent successfully.');
        // 필요한 추가 작업 수행
    } catch (error) {
        console.error('There was an error sending the data:', error);
    }
}

// 게임 종료 처리 함수
function endGame() {
    input.setAttribute("disabled", true);
    
    localStorage.setItem('Wordgame', point); // localStorage에 점수 저장
    point = localStorage.getItem("Wordgame") || 0; // 점수를 localStorage에서 가져오거나 기본값 0 설정
    // var point = 997; // 점수를 localStorage에서 가져오거나 기본값 0 설정
    // console.log(point);
    // console.log(point+1);

    var userName = getUserName(); // 사용자 이름을 가져옴

    // 서버에 데이터 전송
    sendDataToServer(userName, point);

    // 1초 후에 페이지 새로고침
    setTimeout(() => {
        window.location.href = "../php/lastWordRank.php";
    }, 1000);
}


