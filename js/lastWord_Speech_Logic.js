let recognition = null;

function checkCompatibility() {
    // 음성 인식 API 호환성 확인
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ko-KR";
    recognition.maxAlternatives = 5;

    if (!recognition) {
        alert("음성 API를 사용할 수 없습니다.");
    } else {
        startSpeechRecognition(); // 페이지 로드 시 음성 인식 자동 시작
    }
}

function startSpeechRecognition() {
    console.log("음성 입력 시작");    

    // 음성 입력 시작 이벤트 리스너
    recognition.addEventListener("result", (event) => {
        console.log("음성 인식 결과", event.results);
        let text = event.results[0][0].transcript;
        text = text.replace(/\s+/g, ''); // 띄어쓰기 제거
        input.value = text; // 음성 입력 결과를 input 창에 표시
        handleSpeechInput(text); // 음성 입력 처리 함수 호출


        if (text.includes("그만하기")) {
            console.log("게임 종료");
            recognition.stop();
            window.location.href = "http://localhost/pleaseSay/html/gameChoice.html";
            return;
        }
    });

    recognition.addEventListener("error", (event) => {
        console.error("음성 인식 중 오류 발생: " + event.error);
    });

    recognition.addEventListener("end", () => {
        console.log("음성 인식이 중지되었습니다.");
        recognition.start(); // 녹음이 중지되면 다시 시작
    });

    recognition.start();
}

function endSpeechRecognition() {
    console.log("음성 입력 종료");
    recognition.stop();
}

// 음성 입력 이벤트 처리 함수
function handleSpeechInput(text) {
    const prevWord = keyWord.innerHTML;
    const word = text.trim();

    clearInterval(start);

    // 입력된 단어가 이전 단어의 마지막 글자와 이어지는지 확인
    if (word.length > 1 && HanTools.dueum(prevWord[prevWord.length - 1]) === word[0]) {
        fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${word}&advanced=y&method=exact`)
            .then(res => res.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");

                const result = xmlDoc.getElementsByTagName("total")[0].childNodes[0].nodeValue;

                if (result > 0) {
                    input.value = '';
                    input.style.outline = '';
                    point = point + (word.length * 10);
                    pointZone.innerHTML = point;

                    fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${HanTools.dueum(word[word.length - 1])}&advanced=y&sort=popular&type1=word&method=start&num=100&pos=1`)
                        .then(res => res.text())
                        .then(comData => {
                            const comXmlDoc = parser.parseFromString(comData, "text/xml");
                            const item = comXmlDoc.getElementsByTagName("item");

                            let comWord = [];

                            Array.from(item).forEach(item => comWord.push(item.getElementsByTagName("word")[0].childNodes[0].nodeValue));

                            comWord = comWord.map(word => word.replace(/\-|\^/g, ""))
                                .filter(word => word.length > 1);

                            if (comWord.length > 0) {
                                keyWord.innerHTML = comWord[Math.floor(Math.random() * comWord.length)];
                            } else {
                                handleNoMatchingWords();
                            }

                            timeCheck();
                            startTimer();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    handleInvalidWord();
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        handleInvalidWord();
    }
}

function handleInvalidWord() {
    const originalBorderColor = input.style.borderColor;
    const originalKeyWord = keyWord.innerHTML;
    
    // 입력 필드의 테두리 색상을 빨간색으로 변경
    input.value = '';
    input.style.borderColor = 'red';
    keyWord.innerHTML = "잘못된 단어를 입력했습니다.";
    
    // 1초 후 원래 상태로 복원
    setTimeout(() => {
        input.style.borderColor = originalBorderColor;
        keyWord.innerHTML = originalKeyWord;
    }, 1000);
    
    // 잘못된 입력이 있을 때, 새로운 단어를 제공하지 않고 타이머를 다시 시작합니다.
    timeCheck();
    startTimer();
}


function handleNoMatchingWords() {
    keyWord.innerHTML = "이어질 단어가 없습니다."; // 안내 메시지 표시
    // alert("이어질 단어가 없습니다."); // 경고 메시지 표시
    point = point + 100; // 점수 100점 추가
    pointZone.innerHTML = point;

    fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${HanTools.dueum(keyWord.innerHTML[0])}&advanced=y&sort=popular&type1=word&method=start&num=100&pos=1`)
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const item = xmlDoc.getElementsByTagName("item");

            let comWord = [];

            Array.from(item).forEach(item => comWord.push(item.getElementsByTagName("word")[0].childNodes[0].nodeValue));

            comWord = comWord.map(word => word.replace(/\-|\^/g, ""))
                .filter(word => word.length > 1);

            if (comWord.length > 0) {
                keyWord.innerHTML = comWord[Math.floor(Math.random() * comWord.length)];
            } else {
                keyWord.innerHTML = "랜덤 단어가 없습니다.";
            }

            timeCheck();
            startTimer();
        })
        .catch(error => {
            console.log(error);
        });
}

window.addEventListener("load", checkCompatibility);
