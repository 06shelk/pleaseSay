window.addEventListener('DOMContentLoaded', function() {
    const endGame = document.querySelector('.endGame');
    const pronGame = document.querySelector('.PronGame');

    function handleMouseOver(element) {
        element.style.fontSize = '100px';
        element.style.width = '600px';
        element.style.color = '#FF4242';
        element.style.border = '#FF4242 3px solid';
    }

    function handleMouseOut(element) {
        element.style.fontSize = '';
        element.style.width = '500px';
        element.style.border = '#ffffff 3px solid';
        element.style.color = '#ffffff';
    }

    // endGame에 마우스를 올렸을 때의 이벤트 처리
    endGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        pronGame.style.color = 'black';
        pronGame.style.border = 'black 3px solid';
    });

    endGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        pronGame.style.color = '';
        pronGame.style.border = '#ffffff 3px solid';
    });

    // PronGame에 마우스를 올렸을 때의 이벤트 처리
    pronGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        endGame.style.color = 'black';
        endGame.style.border = 'black 3px solid';
    });

    pronGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        endGame.style.color = '';
        endGame.style.border = '#ffffff 3px solid';
    });

    var recognition = new webkitSpeechRecognition(); // 음성 인식 객체 생성
    recognition.lang = "ko-KR"; // 한국어 설정

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript.toLowerCase(); // 인식된 음성을 소문자로 변환
        if (transcript === "끝말잇기") {
            // "끝말잇기"를 말한 경우에만 해당 요소가 화면에 나타나도록 함
            endGame.dispatchEvent(new MouseEvent('mouseover'));
            setTimeout(function() {
                endGame.dispatchEvent(new MouseEvent('mouseout'));
                window.location.href = "index.html"; 
            }, 1000); // 1초 후에 마우스 아웃 이벤트 발생
        } else if (transcript === "발음 테스트") {
            // "발음"을 말한 경우에만 해당 요소가 화면에 나타나도록 함
            
            pronGame.dispatchEvent(new MouseEvent('mouseover'));
            setTimeout(function() {
                
                pronGame.dispatchEvent(new MouseEvent('mouseout'));
                window.location.href = "index.html"; 
            }, 1000); // 1초 후에 마우스 아웃 이벤트 발생
            
        } else {
            console.log(transcript);
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
