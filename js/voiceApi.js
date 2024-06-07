// 게임 시작 페이지로 이동하는 함수
function startGame() {
    window.location.href = "http://localhost/pleaseSay/html/nameChange.html";
}


// 랭킹 페이지로 이동하는 함수
function ranking() {
    window.location.href = "http://localhost/pleaseSay/html/rankGameChoice.html";
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
        window.location.href = "http://localhost/pleaseSay/php/lastWordRank.php"; 
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
        handleMouseEvent(pronGame, "http://localhost/pleaseSay/php/pronRank.php");
    }
}

// 음성 인식 및 명령 처리
function handleVoiceRecognition(event) {
    var transcript = event.results[0][0].transcript.toLowerCase(); // 인식된 음성을 소문자로 변환
    var currentUrl = window.location.href; // 현재 URL을 변수에 저장
    console.log(currentUrl);

    if (transcript === "게임고르기" || transcript === "게임 고르기") {
        startGame(); // 게임 선택 페이지로 이동
    } else if (transcript === "랭킹보기" || transcript === "랭킹 보기") {
        ranking(); // 랭킹 페이지로 이동
    } else if (transcript === "다음") {
        moveToNextPage(currentUrl); // 다음 페이지로 이동
    } else if (transcript === "이전") {
        moveToPrevPage(currentUrl); // 다음 페이지로 이동
    } else if (transcript === "도움말") {
        // 도움말 아이콘 표시 처리
        var icon = document.getElementById('questionIcon');
        var questionExp = document.getElementById('questionExp');
        icon.src = '../img/questionIconHover.png'; // 아이콘 이미지 변경
        questionExp.style.display = 'block'; // 말풍선 표시
    } else if (transcript === "종료") {
        // 도움말 아이콘 종료 처리
        var icon = document.getElementById('questionIcon');
        var questionExp = document.getElementById('questionExp');
        // 아이콘 이미지 변경
        icon.src = '../img/questionIcon.png';
        // 말풍선 표시
        questionExp.style.display = 'none';
    } else if (transcript === "그만하기") {
        window.location.href = "gameChoice.html"; // 게임 선택 페이지로 이동
    } else if (transcript === "끝말잇기" || transcript === "끝말 잇기" ) {        
        lastGameMove(currentUrl);
    } else if (transcript === "발음테스트" || transcript === "발음 테스트" ) {        
        pronGameMove(currentUrl);
    } else if (transcript === "발음테스트" || transcript === "발음 테스트" ) {        
            
    }  else {
        console.log("다른 단어를 말해도 녹음 유지됨.");
        if (window.location.href == "../html/nameChange.html") {
            alert("확인")
        }
    }
}


// 페이지 로드 시 음성 인식 시작
window.addEventListener('DOMContentLoaded', function() {
    var recognition = new webkitSpeechRecognition(); // 음성 인식 객체 생성
    recognition.lang = "ko-KR"; // 한국어 설정

    recognition.onresult = function(event) {
        handleVoiceRecognition(event); // 음성 인식 결과 처리
    };

    recognition.onerror = function(event) {
        console.error("음성 인식 중 오류 발생: " + event.error);
    };

    recognition.onend = function() {
        console.log("음성 인식이 중지되었습니다.");
        recognition.start(); // 녹음이 중지되면 다시 시작
    };

    recognition.start(); // 음성 인식 시작
});
