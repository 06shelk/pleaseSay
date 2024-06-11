function next() {
    window.location.href = "http://localhost/pleaseSay/html/gameChoice.html";
}
function no() {
    const userIdInput = document.getElementById('user_id');
    const confirmNameDiv = document.getElementById('confirmName');
    userIdInput.value = '';
    confirmNameDiv.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const userIdInput = document.getElementById('user_id');
    const confirmNameDiv = document.getElementById('confirmName');
    const nicknameSpan = document.getElementById('nickname');
    const titleContainer = document.querySelector('.title_container h1'); 
    const originalTitle = titleContainer.innerHTML; // 원래 문장을 저장

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
        
        if (spokenText.length > 10) {
            titleContainer.innerHTML = "입력하신 닉네임이 너무 깁니다.";
            setTimeout(() => {
                titleContainer.innerHTML = originalTitle; // 2초 후 원래 문장으로 변경
                startRecognition(); // 음성 인식을 다시 
            }, 2000);
            return;
        }

        if(levenshteinDistance("이전", spokenText) <= 1) {
            window.location.href = '../index.html';
        }
        
        if (confirmNameDiv.style.display === 'none') {
            // 첫 번째 음성 인식: 닉네임 설정
            userIdInput.value = spokenText;
            nicknameSpan.textContent = spokenText;
            confirmNameDiv.style.display = 'flex';
            // 새 음성 인식을 시작하여 사용자의 "예" 또는 "아니오" 응답을 기다림
            startRecognition();
        } else {
            // 두 번째 음성 인식: 확인 메시지에 대한 응답 처리
            if (levenshteinDistance("네", spokenText) <= 1 || levenshteinDistance("다음", spokenText) <= 1) {
                localStorage.setItem('userName', nicknameSpan.textContent);
                console.log(spokenText);
                // const xhr = new XMLHttpRequest();
                // xhr.open('POST', '../php/nameChangeLogic.php', true);
                // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                // xhr.onload = function () {
                //     if (xhr.status === 200) {
                //         // PHP 스크립트의 처리가 완료된 후에 다음 페이지로 이동
                        window.location.href = '../html/gameChoice.html';
                //     }
                // };
                // xhr.send(`user_id=${nicknameSpan.textContent}`);
                
            } else if (levenshteinDistance("아니요", spokenText) <= 1 ) {
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