// inputValue.js
function goBack() {
    window.location.href = '../html/gameChoice.html'
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

            // recognition.addEventListener("speechstart", () => {
            //     console.log("speech Start");
            // });

            recognition.addEventListener("speechend", () => {
                console.log("speech End");
            });

            recognition.addEventListener("result", (event) => {
                console.log("speech Result", event.results);
                const text = event.results[0][0].transcript;
                document.getElementById("speech_result").value = text;

                if (text.includes("그만하기")) {
                    console.log("게임 종료");
                    recognition.stop();
                    window.location.href = "../html/gameChoice.html";
                    return;
                }


                const titleElement = document.getElementById("question");
                const inputText = text.toLowerCase().split(' ').join('');
            

                // 문제와 input 창의 결과가 같은지 
                if (titleElement) {
                    const title = titleElement.innerText;
                    const titleText = title.toLowerCase().split(' ').join('');
                    if (inputText === titleText) {
                        console.log("ok" + inputText + " " + titleText);
                        recognition.stop();
                    }else {
                        console.log("틀렸습니다." + inputText + " " + titleText);
                    }

                    updateScore(inputText, titleText);
                } else {
                    console.error("Title element not found.");
                }
            });
        }
    }catch(error) {
        //에러가 나도 무시하고 진행
        console.error("에러가 났지만 무시하고 진행한다.", error);
    }
}

function startSpeechREcognition() {
    console.log("Start");
    recognition.start();
}

function endSpeechREcognition() {
    recognition.stop();
}

window.addEventListener("load", checkCompatibility);
