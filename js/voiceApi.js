window.addEventListener('DOMContentLoaded', function() {
    var recognition = new webkitSpeechRecognition(); // 음성 인식 객체 생성
    recognition.lang = "ko-KR"; // 한국어 설정

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript.toLowerCase(); // 인식된 음성을 소문자로 변환
        var currentUrl = window.location.href; // 현재 URL을 변수에 저장

        if (transcript === "게임 고르기") {
            window.location.href = "gameChoice.html"; // 다음 페이지로 이동
        } else if (transcript === "랭킹보기") {
            window.location.href = "test.html"; // 다음 페이지로 이동
        } else if (transcript === "다음 화면") {
            if (currentUrl.includes("index.html")) {
                window.location.href = "pronRule.html"; // test.html에서 game.html로 이동
            } else if (currentUrl.includes("ss.html")) {
                window.location.href = "game1.html"; // ss.html에서 game1.html로 이동
            } else {
                console.log("현재 페이지에 맞는 다음 이동 페이지가 정의되지 않았습니다.");
            }
        } else {
            console.log("다른 단어를 말해도 녹음 유지됨.");
        }
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
