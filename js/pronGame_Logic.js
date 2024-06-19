let sentences = [
    {
        "id": 1,
        "title": "간장 공장 공장장은 강 공장장이고 된장 공장 공장장은 공 공장장이다",
    },
    {
        "id": 2,
        "title": "저기 계신 저분이 박 법학박사이고 여기 계신 이 분이 백 법학박사이다",
    },
    {
        "id": 3,
        "title": "서울특별시 특허허가과 허가과장 허과장",
    },
    {
        "id": 4,
        "title": "시골 찹쌀 햇찹쌀 도시 찹쌀 촌 찹쌀",
    },
    {
        "id": 5,
        "title": "고려고 교복은 고급 교복이다 고려고 교복은 고급 원단을 사용했다",
    },
    {
        "id": 6,
        "title": "7월7일은 평창 친구 친정 칠순 잔칫날",
    },
    {
        "id": 7,
        "title": "저기 있는 말뚝이 말 맬 말뚝이냐 말 못 맬 말뚝이냐",
    },
    {
        "id": 8,
        "title": "솔바람이 솔솔 송이버섯이 우수수 떨어지는 선산에 앉아 선선한 바람을 만끽했다",
    },
    {
        "id": 9,
        "title": "내가 그린 구름 그림은 새털구름 그린 구름 그림이고 네가 그린 구름 그림은 깃털 구름 그린 구름 그림이다",
    },
    {
        "id": 10,
        "title": "우유 성분 함유율은 칼슘 함유율이 철분 함유량보다 높은가 철분 함유량이 칼슘 함유량보다 높은가",
    },
    {
        "id": 11,
        "title": "정경담당 정선생님 상담담당 성선생님",
    }
];
var point =0;

function goBack() {
    window.location.href = '../html/gameChoice.html';
}

let score = 0;

const countDownElement = document.getElementById('question');
const startMessageElement = document.getElementById('start-message');
const gameElements = document.querySelectorAll('.prongame_container > *');

function startCountDownRound(callback) {
    let count = 3;
    countDownElement.textContent = count;

    const countInterval = setInterval(() => {
        count--;
        if (count === 0) {
            clearInterval(countInterval);
            countDownElement.textContent = "Game Start!";
            
            setTimeout(() => {
                startMessageElement.style.display = 'none';
                document.getElementById('wrap').style.display = 'block';
                callback();
            }, 1000); // 1초 후에 메시지 숨기기
        } else {
            countDownElement.textContent = count;
        }
    }, 1000);
}

window.onload = function() {
    start_game();
};

function start_game() {
    console.log("게임 시작");
    document.getElementById('timer').style.display = 'block';
    document.getElementById('question').style.display = 'block';
    document.getElementById('speech_result').style.display = 'block';
    document.querySelector(".round").style.display = 'block';
    score = 0;

    play_next_round(1);
}

var array = [];

function play_game_step(step) {
    startCountDownRound(() => {
        document.querySelector(".round").innerHTML = step;

        var input = document.getElementById("speech_result");
        input.value = null;

        let rand1;
        do {
            rand1 = Math.floor(Math.random() * sentences.length);
        } while (array.includes(rand1));

        array.push(rand1);

        document.getElementById("question").innerHTML = sentences[rand1].title;

        startSpeechREcognition();
        updateMicIcon(true);
    });
}

function play_next_round(currentRound) {
    if (currentRound <= 5) {
        play_game_step(currentRound);
        console.log("다음 라운드까지 3초 대기...");
        
        setTimeout(function () {
            play_next_round(currentRound + 1);
        }, 12000);

    } else {
        show_result();
    }
}

// 이름 받기 함수
function getUserName() {
    var defaultUserName = "exampleUserName"; // 기본 사용자 이름 설정
    var userName = localStorage.getItem("userName") || defaultUserName;
    return userName;
}

// 서버에 데이터 전송 함수
async function sendDataToServer(userName, point) {
    try {
        const response = await axios.post('http://localhost/pleaseSay/php/fetch_pronRank.php', {
            userName: userName,
            score: point
        });

        console.log('Data sent successfully.');
        // 필요한 추가 작업 수행
    } catch (error) {
        console.error('There was an error sending the data:', error);
    }
}

function show_result() {
    console.log("결과창");
    console.log(score);
    localStorage.setItem("Prongame", score);

    point = localStorage.getItem("Prongame") || 0;
    var userName = getUserName(); // 사용자 이름을 가져옴

    sendDataToServer(userName, point);

    setTimeout(() => {
        window.location.href = "../php/pronRank.php"; 
    }, 1000);
}

function updateScore(inputText, titleText) {
    const maxScore = 20;
    const distance = levenshteinDistance(inputText, titleText);
    const similarityScore = Math.max(0, maxScore - distance);

    score += similarityScore;
    console.log("현재 스코어: " + score);
}
