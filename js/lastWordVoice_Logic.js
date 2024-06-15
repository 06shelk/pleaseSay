let recognition = null;

function checkCompatibility() {
    try {

        if (!recognition) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "ko";
            recognition.maxAlternatives = 9;

            if (!recognition) {
                alert("You cannot use speech api.");
            }

            recognition.addEventListener("speechstart", handleSpeechStart);
            recognition.addEventListener("speechend", handleSpeechEnd);
            recognition.addEventListener("result", handleSpeechResult);
        }
    } catch (error) {
        console.error("에러가 났지만 무시하고 진행한다.", error);
    }

    recognition.addEventListener("error", (event) => {
        console.error("음성 인식 중 오류 발생: " + event.error);
    });

    recognition.addEventListener("end", () => {
        console.log("음성 인식이 중지되었습니다.");
        recognition.start(); // 녹음이 중지되면 다시 시작
    });
}

// speechstart 이벤트 핸들러
function handleSpeechStart() {
    console.log("speech Start");
}

// speechend 이벤트 핸들러
function handleSpeechEnd() {
    console.log("speech End");
}

// 음성 인식 시작 핸들러
function startSpeechRecognition() {
    console.log("음성 입력 시작");    
    recognition.start();
}

// 음성 인식 종료 핸들러
function endSpeechRecognition() {
    console.log("음성 입력 종료");
    recognition.stop();
}

// 음성 결과 이벤트 핸들러
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
}

// 음성 입력 이벤트 처리 함수
function handleSpeechInput(text) {
    const prevWord = keyWord.innerHTML;
    const word = text.trim();
    const originalBorderColor = input.style.borderColor;
    

    // clearInterval(start);

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
                    input.style.borderColor = '#42FF60';
                    keyWord.innerHTML = "단어 준비 중..."
                    pauseTimer();

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
                                input.style.borderColor = originalBorderColor;
                                resumeTimer();
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

// 잘못된 단어 처리
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
    // startTimer();
    
}

// 한방 단어
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

            // 시간 다시 흐르게 함
            resumeTimer();
        })
        .catch(error => {
            console.log(error);
        });
}

// 페이지 로드 시 checkCompatibility 함수 실행
window.addEventListener("load", checkCompatibility);
