document.addEventListener('DOMContentLoaded', () => {
    const userIdInput = document.getElementById('user_id');
    const confirmNameDiv = document.getElementById('confirmName');
    const nicknameSpan = document.getElementById('nickname');

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';
    let isRecognizing = false;

    const startRecognition = () => {
        if (!isRecognizing) {
            recognition.start();
            isRecognizing = true;
        }
    };

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.trim();
        
        if (confirmNameDiv.style.display === 'none') {
            // 첫 번째 음성 인식: 닉네임 설정
            userIdInput.value = spokenText;
            nicknameSpan.textContent = spokenText;
            confirmNameDiv.style.display = 'flex';
            // 새 음성 인식을 시작하여 사용자의 "예" 또는 "아니오" 응답을 기다림
            startRecognition();
        } else {
            // 두 번째 음성 인식: 확인 메시지에 대한 응답 처리
            if (spokenText === '예' || spokenText === '네' || spokenText === '다음') {
                localStorage.setItem('userName', nicknameSpan.textContent);
                window.location.href = '../html/gameChoice.html';
                
            } else if (spokenText === '아니오' || spokenText === '아니요' ) {
                userIdInput.value = '';
                confirmNameDiv.style.display = 'none';
                // 초기 상태로 돌아가 첫 음성 인식 시작
                startRecognition();
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (confirmNameDiv.style.display === 'none') {
            startRecognition(); // 오류 발생 시 음성 인식 재시작
        }
    };

    recognition.onend = () => {
        isRecognizing = false;
        startRecognition(); // 음성 인식 종료 시 다시 시작
    };

    // 페이지 로드 시 첫 음성 인식 시작
    startRecognition();
});