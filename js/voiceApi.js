// 게임 시작 페이지로 이동하는 함수
function startGame() {
    window.location.href = "html/nameChange.html";
}


// 랭킹 페이지로 이동하는 함수
function ranking() {
    window.location.href = "html/rankGameChoice.html";
}

// 다음 페이지로 이동하는 함수
function moveToNextPage(currentUrl) {
    if (currentUrl.includes("lastWordRule.html")) {
        window.location.href = "lastWordGame.html";
    } else if (currentUrl.includes("pronRule.html")) {
        window.location.href = "pronGame.html"; 
    } else if (currentUrl.includes("pronRank.php")) {
        window.location.href = "../index.html"; 
    } else {
        console.log("현재 페이지에 맞는 다음 이동 페이지가 정의되지 않았습니다.");
    }
}

// 이전 페이지로 이동하는 함수
function moveToPrevPage(currentUrl) {
    if (currentUrl.includes("nameChange.html")) {
        window.location.href = "index.html";
    } else if (currentUrl.includes("gameChoice.html")) {
        window.location.href = "nameChange.html"; 
    } else if (currentUrl.includes("pronRule.html")) {
        window.location.href = "gameChoice.html";
    } else if (currentUrl.includes("lastWordRule.html")) {
        window.location.href = "gameChoice.html"; 
    }else if (currentUrl.includes("rankGameChoice.html")) {
        window.location.href = "../index.html";    
    }else if (currentUrl.includes("lastWordRank.php")) {
        window.location.href = "../html/rankGameChoice.html";    
    }else if (currentUrl.includes("pronRank.php")) {
        window.location.href = "../html/rankGameChoice.html";    
    }else {
        console.log("현재 페이지에 맞는 다음 이동 페이지가 정의되지 않았습니다.");
    }
}

// "끝말잇기" or "끝말 잇기"라고 말했을 경우
function lastGameMove(currentUrl) {
    if (currentUrl.includes("gameChoice.html")) {
        const endGame = document.querySelector('.endGame');
        endGame.dispatchEvent(new MouseEvent('mouseover'));
        setTimeout(function() {
            endGame.dispatchEvent(new MouseEvent('mouseout'));
            window.location.href = "lastWordRule.html"; 
        }, 1000);

    } else if (currentUrl.includes("rankGameChoice.html")) {
        const endGame = document.querySelector('.endGame');
        endGame.dispatchEvent(new MouseEvent('mouseover'));
        setTimeout(function() {
            endGame.dispatchEvent(new MouseEvent('mouseout'));
            window.location.href = "../php/lastWordRank.php"; 
        }, 1000);
    }
}

// 선택 결과로 보이기
function handleMouseEvent(element, url) {
    element.dispatchEvent(new MouseEvent('mouseover'));
    setTimeout(function() {
        element.dispatchEvent(new MouseEvent('mouseout'));
        window.location.href = url;
    }, 1000); // 1초 후에 마우스 아웃 이벤트 발생
}

// "발음테스트" or "발음 테스트"라고 말했을 경우
function pronGameMove(currentUrl) {
    const pronGame = document.querySelector('.PronGame');
    if (currentUrl.includes("gameChoice.html")) {
        handleMouseEvent(pronGame, "pronRule.html");
    } else if (currentUrl.includes("rankGameChoice.html")) {
        handleMouseEvent(pronGame, "../php/pronRank.php");
    }
}

// 음성 인식 및 명령 처리
function handleVoiceRecognition(event) {
    var transcript = event.results[0][0].transcript.toLowerCase(); // 인식된 음성을 소문자로 변환
    var currentUrl = window.location.href; // 현재 URL을 변수에 저장
    console.log(currentUrl);
    console.log(transcript);
    
    // 명령어와 각 명령어의 유사도 계산
    const commands = {
        "게임 시작하기": levenshteinDistance("게임 시작하기", transcript),
        "랭킹 보기": levenshteinDistance("랭킹 보기", transcript),
        "다음": levenshteinDistance("다음", transcript),
        "이전": levenshteinDistance("이전", transcript),
        "그만하기": levenshteinDistance("그만하기", transcript),
        "끝말 잇기": levenshteinDistance("끝말 잇기", transcript),
        "발음 테스트": levenshteinDistance("발음 테스트", transcript),
        "돌아가기": levenshteinDistance("돌아가기", transcript)
    };

    // 가장 유사한 명령어를 찾음
    const closestCommand = Object.keys(commands).reduce((a, b) => commands[a] < commands[b] ? a : b);

    // 가장 유사한 명령어의 유사도
    const closestDistance = commands[closestCommand];
    console.log(closestDistance);
    // 가장 유사한 명령어에 따른 동작 실행
    switch (closestCommand) {
        case "게임 시작하기":
            if (closestDistance <= 3) {
                startGame(); // 게임 선택 페이지로 이동
            }
            break;
        case "랭킹 보기":
            if (closestDistance <= 3) {
                ranking(); // 랭킹 페이지로 이동
            }
            break;
        case "다음":
            if (closestDistance <= 3) {
                moveToNextPage(currentUrl); // 다음 페이지로 이동
            }
            break;
        case "이전":
            if (closestDistance <= 3) {
                moveToPrevPage(currentUrl); // 이전 페이지로 이동
            }
            break;
        case "그만하기":
            if (closestDistance <= 3) {
                window.location.href = "gameChoice.html"; // 게임 선택 페이지로 이동
            }
            break;
        case "끝말 잇기":
            if (closestDistance <= 3) {
                lastGameMove(currentUrl); // 끝말잇기 페이지로 이동
            }
            break;
        case "발음 테스트":
            if (closestDistance <= 3) {
                pronGameMove(currentUrl); // 발음 테스트 페이지로 이동
            }
            break;
        case "돌아가기":
            if (closestDistance <= 3) {
                if(currentUrl.includes("pronRank.php") || currentUrl.includes("lastWordRank.php")) {
                    window.location.href = "../index.html"; // 랭킹 페이지에서 처음화면으로
                }
            }
            break;
        default:
            console.log("다른 단어를 말해도 녹음 유지됨.");
            if (window.location.href == "../html/nameChange.html") {
                alert("확인");
            }
            break;
    }
}


// 페이지 로드 시 음성 인식 시작
window.addEventListener('DOMContentLoaded', function() {
    var recognition = new webkitSpeechRecognition(); // 음성 인식 객체 생성
    recognition.lang = "ko-KR"; // 한국어 설정

    recognition.onstart = function() {
        console.log("음성 인식이 시작되었습니다.");
        // 이미지 변경
        const icon = document.getElementById('questionIcon');
        if (currentUrl.includes("index.html")) { 
            icon.src = './img/mic.gif';
        }else {
            icon.src = '../img/mic.gif'; 
        }
    };

    recognition.onresult = function(event) {
        handleVoiceRecognition(event); // 음성 인식 결과 처리
    };

    recognition.onerror = function(event) {
        console.error("음성 인식 중 오류 발생: " + event.error);
    };

    recognition.onend = function() {
        const icon = document.getElementById('questionIcon');
        if (currentUrl.includes("index.html")) { 
            icon.src = './img/mic_none.png';
        }else {
            icon.src = '../img/mic_none.png'; 
        }
        
        console.log("음성 인식이 중지되었습니다.");
        recognition.start(); // 녹음이 중지되면 다시 시작
    };

    recognition.start(); // 음성 인식 시작
});
