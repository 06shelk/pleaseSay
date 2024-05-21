//파일 가져오기
// import { startSpeechREcognition } from "./inputValue.js";

let sentences = [
    {
        "id": 1,
        "title": "간장 공장 공장장은 강 공장장이고 된장 공장 공장장은 공 공장장이다",
    },
    {
        "id": 2,
        "title": "저기 계신 저분이 박 법학 박사이고 여기 계신 이 분이 백 법학 박사이다",
    },
    {
        "id": 3,
        "title": "저기 계신 저분이 박 법학 박사이고 여기 계신 이 분이 백 법학 박사이다",
    },
    {
        "id": 4,
        "title": "저기 계신 저분이 박 법학 박사이고 여기 계신 이 분이 백 법학 박사이다",
    },
    {
        "id": 5,
        "title": "저기 계신 저분이 박 법학 박사이고 여기 계신 이 분이 백 법학 박사이다",
    },
    {
        "id": 6,
        "title": "7월 7일은 평창 친구 친정 칠순 잔칫날",
    },
    {
        "id": 7,
        "title": "7월 7일은 평창 친구 친정 칠순 잔칫날",
    },
    {
        "id": 8,
        "title": "7월 7일은 평창 친구 친정 칠순 잔칫날",
    },

];


let score = 0;

const countDownElement = document.getElementById('countdown');
const startMessageElement = document.getElementById('start-message');
const gameElements = document.querySelectorAll('.prongame_container > *');

// 숫자 카운트 다운 함수
function startCountDown() {
    let count = 3;
    countDownElement.textContent = count;

    const countInterval = setInterval(() => {
        count--;
        if (count === 0) {
            clearInterval(countInterval);
            countDownElement.style.display = 'none';
            startMessageElement.textContent = "Game Start!";
            
            setTimeout(() => {
                startMessageElement.style.display = 'none';
                wrap.style.display = 'block';
                start_game();
            }, 1000); // 1초 후에 메시지 숨기기
        } else {
            countDownElement.textContent = count;
        }
    }, 1000);
}

window.onload = function() {
    startCountDown();
};



// 게임 시작 함수
function start_game() {
    console.log("게임 시작");
    // 요소들 보이기
    document.getElementById('timer').style.display = 'block';
    document.getElementById('question').style.display = 'block';
    document.getElementById('speech_result').style.display = 'block';
    document.querySelector(".round").style.display = 'block';
    score = 0;

    play_next_round(1);
}


var array = [];

// 게임 라운드 함수
function play_game_step(step) {

    // 화면에 라운드가 업그레이드됨
    document.querySelector(".round").innerHTML = step;

    // 입력창의 값이 ''이 됨
    var input = document.getElementById("speech_result");
    input.value = null;

    // 한 문장이 랜덤으로 나옴 (중복 x)
    let rand1;
    do {
        rand1 = Math.floor(Math.random() * sentences.length);
    } while (array.includes(rand1));

    array.push(rand1); // 중복 체크를 위한 배열에 추가

    document.getElementById("question").innerHTML = sentences[rand1].title;

    // 목소리 인식
    startSpeechREcognition();
       
}

// 라운드 별로 기다리는 시간
function play_next_round(currentRound) {

    if (currentRound <= 5) {
        play_game_step(currentRound);
        console.log("다음 라운드까지 3초 대기...");
        
        setTimeout(function () {
            play_next_round(currentRound + 1);
        }, 10000);

    } else {
        // 마지막 라운드 이후 결과 표시
        show_result();
    }
}

// 결과
function show_result() {
    console.log("결과창");
    console.log(score);
}


// 점수 계산 로직
function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Deletion
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[b.length][a.length];
}

// Update the score based on Levenshtein similarity
function updateScore(inputText, titleText) {
    const maxScore = 10; // 최대 점수
    const distance = levenshteinDistance(inputText, titleText);
    const similarityScore = Math.max(0, maxScore - distance);

    score += similarityScore;
    document.getElementById("scoreText").innerHTML = score;
    console.log("현재 스코어: " + score);
}
