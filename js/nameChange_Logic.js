// 다른 페이지로 이동하는 함수
function next() {
    window.location.href = "../html/gameChoice.html";
}

// 닉네임 재입력 함수
function no() {
    const userIdInput = document.getElementById('user_id');
    const confirmNameDiv = document.getElementById('confirmName');
    userIdInput.value = '';
    confirmNameDiv.style.display = 'none';
}

// 페이지 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
    const userIdInput = document.getElementById('user_id');
    const confirmNameDiv = document.getElementById('confirmName');
    const nicknameSpan = document.getElementById('nickname');
    const titleContainer = document.querySelector('.title_container h1'); 
    const originalTitle = titleContainer.innerHTML; // 원래 문장을 저장

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';
    let isRecognizing = false;

    // 음성 인식 시작 함수
    const startRecognition = () => {
        if (!isRecognizing) {
            recognition.start();
            isRecognizing = true;
            updateMicIcon(true);
        }
    };

    // 음성 인식 결과 처리
    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.trim();

        if (spokenText.length > 10) {
            titleContainer.innerHTML = "입력하신 닉네임이 너무 깁니다.";
            setTimeout(() => {
                titleContainer.innerHTML = originalTitle; // 2초 후 원래 문장으로 변경
                startRecognition(); // 음성 인식을 다시 시작
            }, 2000);
            return;
        }

        if (levenshteinDistance("이전", spokenText) <= 1) {
            window.location.href = '../index.html';
        }

        if (confirmNameDiv.style.display === 'none') {
            userIdInput.value = spokenText;
            nicknameSpan.textContent = spokenText;
            confirmNameDiv.style.display = 'flex';
            startRecognition(); // 새로운 인식을 시작
        } else {
            if (levenshteinDistance("네", spokenText) <= 1 || levenshteinDistance("다음", spokenText) <= 2) {
                localStorage.setItem('userName', nicknameSpan.textContent);
                window.location.href = '../html/gameChoice.html';
            } else if (levenshteinDistance("다시하기", spokenText) <= 1) {
                no(); // 초기 상태로 돌아가기
                startRecognition();
            }else {
                console.log("어쩌라는거임?")
            }
        }
    };

    // 음성 인식 오류 처리
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        startRecognition(); // 오류 발생 시 음성 인식 재시작
    };

    // 음성 인식 종료 처리
    recognition.onend = () => {
        updateMicIcon(false);
        isRecognizing = false;
        startRecognition(); // 음성 인식 종료 시 다시 시작
    };

    // 페이지 로드 시 첫 음성 인식 시작
    startRecognition();
});