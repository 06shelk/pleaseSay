const icon = document.getElementById('questionIcon');
const questionExp = document.getElementById('questionExp');
const gameDescription = document.getElementById('gameDescription');

icon.addEventListener('mouseover', () => {
    icon.src = '../img/questionIconHover.png';
    questionExp.style.display = 'block'; // 말풍선 표시
});

icon.addEventListener('mouseout', () => {
    icon.src = '../img/questionIcon.png';
    questionExp.style.display = 'none'; // 말풍선 숨김
});

questionExp.addEventListener('mouseover', () => {
    questionExp.style.display = 'block'; // 말풍선 표시
});

questionExp.addEventListener('mouseout', () => {
    questionExp.style.display = 'none'; // 말풍선 숨김
});


window.addEventListener('DOMContentLoaded', function() {
    var recognition = new webkitSpeechRecognition(); // 음성 인식 객체 생성
    recognition.lang = "ko-KR"; // 한국어 설정

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript.toLowerCase(); // 인식된 음성을 소문자로 변환
        if (transcript === "도움말") {
            // "도움말"을 말한 경우에는 아이콘이 마우스 오버한 것과 같이 나타나도록 처리
            var icon = document.getElementById('questionIcon');
            var questionExp = document.getElementById('questionExp');

            // 아이콘 이미지 변경
            icon.src = '../img/questionIconHover.png';

            // 말풍선 표시
            questionExp.style.display = 'block';
        } else if(transcript === "종료"){
            var icon = document.getElementById('questionIcon');
            var questionExp = document.getElementById('questionExp');

            // 아이콘 이미지 변경
            icon.src = '../img/questionIcon.png';

            // 말풍선 표시
            questionExp.style.display = 'none';
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