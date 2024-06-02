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
        const text = event.results[0][0].transcript;
        input.value = text; // 음성 입력 결과를 input 창에 표시
        handleSpeechInput(text); // 음성 입력 처리 함수 호출
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

                    fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${HanTools.dueum(word[word.length - 1])}&advanced=y&sort=popular&type1=word&method=start&num=100`)
                        .then(res => res.text())
                        .then(comData => {
                            const comXmlDoc = parser.parseFromString(comData, "text/xml");
                            const item = comXmlDoc.getElementsByTagName("item");

                            let comWord = [];

                            Array.from(item).forEach(item => comWord.push(item.getElementsByTagName("word")[0].childNodes[0].nodeValue));

                            comWord = comWord.map(word => word.replace(/\-|\^/g, ""))
                                .filter(word => word.length > 1);

                            keyWord.innerHTML = comWord[Math.floor(Math.random() * comWord.length)];

                            timeCheck();
                            start = setInterval(timeCheck, 1000);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    input.value = '';
                    input.style.outline = '1px solid red';
                    start = setInterval(timeCheck, 1000);
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        input.value = '';
        input.style.outline = '1px solid red';
        start = setInterval(timeCheck, 1000);
    }
}

window.addEventListener("load", checkCompatibility);
