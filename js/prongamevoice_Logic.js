function goBack() {
    window.location.href = '../html/gameChoice.html';
}

let recognition = null;

function checkCompatibility() {
    try {

        if (!recognition) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "ko";
            recognition.maxAlternatives = 5;

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
}

// speechstart 이벤트 핸들러
function handleSpeechStart() {
    console.log("speech Start");
}

// speechend 이벤트 핸들러
function handleSpeechEnd() {
    console.log("speech End");
}

// result 이벤트 핸들러
function handleSpeechResult(event) {
    console.log("speech Result", event.results);
    const text = event.results[0][0].transcript;
    document.getElementById("speech_result").value = text;

    if (text.includes("그만하기")) {
        console.log("게임 종료");
        recognition.stop();
        goBack();
        return;
    }

    const titleElement = document.getElementById("question");
    const inputText = text.toLowerCase().split(' ').join('');

    if (titleElement) {
        const title = titleElement.innerText;
        const titleText = title.toLowerCase().split(' ').join('');
        if (inputText === titleText) {
            console.log("ok" + inputText + " " + titleText);
            recognition.stop();
        } else {
            console.log("틀렸습니다." + inputText + " " + titleText);
        }
        updateMicIcon(false);
        updateScore(inputText, titleText);
    } else {
        console.error("Title element not found.");
    }
}

// startSpeechREcognition 함수 추가
function startSpeechREcognition() {
    console.log("Start");
    recognition.start();
}

// endSpeechREcognition 함수 추가
function endSpeechREcognition() {
    recognition.stop();
}

// 페이지 로드 시 checkCompatibility 함수 실행
window.addEventListener("load", checkCompatibility);
