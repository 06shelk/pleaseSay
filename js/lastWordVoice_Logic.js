let recognition = null;
let isRecognitionActive = false; // 음성 인식 상태 플래그
let nextWordActive = true; // 다음 단어 활성 여부 플래그

function checkCompatibility() {
    try {
        if (!recognition) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "ko";
            recognition.maxAlternatives = 9;

            recognition.addEventListener("speechstart", handleSpeechStart);
            recognition.addEventListener("speechend", handleSpeechEnd);
            recognition.addEventListener("result", handleSpeechResult);
            recognition.addEventListener("error", handleError);
            recognition.addEventListener("end", handleEnd);
        }
    } catch (error) {
        console.error("에러가 났지만 무시하고 진행한다.", error);
    }
}

function handleSpeechStart() {
    console.log("speech Start");
    isRecognitionActive = true; 
    updateMicIcon(true);
}

function handleSpeechEnd() {
    console.log("speech End");
    isRecognitionActive = false; 
    updateMicIcon(false);
}

function handleEnd() {
    console.log("음성 인식이 중지되었습니다.");
    isRecognitionActive = false; 
    updateMicIcon(false);
    // 일정 시간 후 음성 인식 재시작
    setTimeout(() => startSpeechRecognition(), 1000);
}

function handleError(event) {
    console.error("음성 인식 중 오류 발생: " + event.error);
    isRecognitionActive = false; // 오류가 발생하면 플래그를 업데이트
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('마이크 권한이 필요합니다.');
    } else if (event.error === 'network') {
        alert('네트워크 오류가 발생했습니다.');
    }
}

function startSpeechRecognition() {
    if (!isRecognitionActive && nextWordActive) { 
        console.log("음성 입력 시작");
        try {
            recognition.start();
            isRecognitionActive = true; 
            updateMicIcon(true);
        } catch (error) {
            console.error("음성 인식 시작 실패:", error);
        }
    } else {
        console.log("음성 인식이 이미 시작되었습니다.");
    }
}

function endSpeechRecognition() {
    if (isRecognitionActive) { // 음성 인식이 진행 중인 경우에만 종료
        console.log("음성 입력 종료");
        recognition.stop();
        isRecognitionActive = false; 
    }
}

function handleSpeechResult(event) {
    console.log("음성 인식 결과", event.results);
    let text = event.results[0][0].transcript;
    text = text.replace(/\s+/g, ''); // 띄어쓰기 제거
    input.value = text; // 음성 입력 결과를 input 창에 표시
    handleSpeechInput(text); // 음성 입력 처리 함수 호출

    if (text.includes("그만하기")) {
        console.log("게임 종료");
        recognition.stop();
        window.location.href = "../html/gameChoice.html";
        return;
    }

    if (nextWordActive) {
        nextWordActive = false; // 기존의 nextWordActive를 false로 
    } else {
        nextWordActive = true; // 다음 단어 준비 중임을 표시
    }
}

function handleSpeechInput(text) {
    const prevWord = keyWord.innerHTML;
    const word = text.trim();

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
                    input.style.borderColor = '#42FF60';
                    keyWord.innerHTML = "단어 준비 중..."
                    pauseTimer();
                    
                    recognition.stop(); // 음성 인식을 중지

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
                                input.style.borderColor = '#ffffff';
                                resumeTimer();
                                nextWordActive = true;
                                startSpeechRecognition(); // 음성 인식을 다시 시작
                            } else {
                                handleNoMatchingWords();
                            }

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
    const originalBorderColor = '#ffffff';
    const originalKeyWord = keyWord.innerHTML;

    input.value = '';
    input.style.borderColor = 'red';
    keyWord.innerHTML = "잘못된 단어를 입력했습니다.";
    recognition.stop(); // 음성 인식을 중지

    setTimeout(() => {
        input.style.borderColor = originalBorderColor;
        keyWord.innerHTML = originalKeyWord;
        nextWordActive = true;
        startSpeechRecognition();
       
    }, 1000);
}

function handleNoMatchingWords() {
    const originalBorderColor = '#ffffff';
    keyWord.innerHTML = "이어질 단어가 없습니다.";
    point = point + 100;
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
                input.style.borderColor = originalBorderColor;
                nextWordActive = true;
                startSpeechRecognition(); // comWord가 있으면 음성 인식 시작
            } else {
                keyWord.innerHTML = "랜덤 단어가 없습니다.";
            }
            resumeTimer();
        })
        .catch(error => {
            console.log(error);
        });
}

window.addEventListener("load", checkCompatibility);
