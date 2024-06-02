const startWords = ["우리말", "끝말잇기", "게임"];
const index = Math.floor(Math.random() * startWords.length);
let word = startWords[index];
let time = 120;  // 타이머를 120초로 설정
let point = 0;
let wordCount = 0;  // 입력된 단어 수를 추적

const apiKey = "D857D92EE2FC749494BF756C5B793649";

const keyWord = document.querySelector(".keyWord");
const timeZone = document.querySelector(".timeZone");
const input = document.querySelector("#word");
const pointZone = document.querySelector("#point");

let timeout = null;
let start = null;

function initGame() {
    keyWord.innerHTML = word;
    pointZone.innerHTML = point;
    input.focus();
    startTimer();
    addInputListener();
}

function startTimer() {
    start = setInterval(timeCheck, 1000);
}

function timeCheck() {
    timeZone.innerHTML = time;
    if (time === 0) {
        clearInterval(start);
        endGame();
    } else {
        if (time <= 10) {
            timeZone.style.color = 'red'; // 시간이 10초 이하일 때 텍스트 색상을 빨간색으로 변경
            timeZone.style.borderColor = 'red';
        }
        time -= 1;
    }
}


function endGame() {
    input.setAttribute("disabled", true);
    alert(`Game Over \n점수: ${point} \n입력된 단어 수: ${wordCount}`);
    setTimeout(() => {
        location.reload();
    }, 1000); // 1초 후에 페이지 새로고침
}

function addInputListener() {
    input.addEventListener("input", handleInput);
}

function handleInput(event) {
    clearTimeout(timeout); // 입력이 있을 때마다 기존 타이머를 초기화하여 지연시간을 재설정합니다.

    if (event.inputType === "insertText") { // 입력 유형이 텍스트 입력인 경우에만 처리합니다.
        timeout = setTimeout(() => {
            const prevWord = keyWord.innerHTML;
            word = input.value;

            if (isValidWord(prevWord, word)) {
                checkWordValidity(word)
                    .then(isValid => {
                        if (isValid) {
                            processValidWord(word);
                        } else {
                            markInvalidInput();
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                markInvalidInput();
            }
        }, 500); // 0.5초의 딜레이를 줘서 입력의 완료를 감지합니다.
    }
    // 음성 입력은 따로 처리하지 않음
}


function isValidWord(prevWord, newWord) {
    return newWord.length > 1 && HanTools.dueum(prevWord[prevWord.length - 1]) === newWord[0];
}

function checkWordValidity(word) {
    return fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${word}&advanced=y&method=exact`)
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const result = xmlDoc.getElementsByTagName("total")[0].childNodes[0].nodeValue;
            return result > 0;
        });
}

function processValidWord(word) {
    input.value = "";
    input.style.outline = "";
    wordCount += 1;  // 유효한 단어가 입력되었을 때 카운트 증가
    updatePoints(word);
    findNextWord(word)
        .then(comWord => {
            keyWord.innerHTML = comWord;
        })
        .catch(error => {
            console.error(error);
        });
}

function updatePoints(word) {
    point += word.length * 10;
    pointZone.innerHTML = point;
}

function findNextWord(word) {
    return fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${HanTools.dueum(word[word.length - 1])}&advanced=y&sort=popular&type1=word&method=start&num=100`)
        .then(res => res.text())
        .then(comData => {
            const parser = new DOMParser();
            const comXmlDoc = parser.parseFromString(comData, "text/xml");
            const item = comXmlDoc.getElementsByTagName("item");
            let comWords = [];

            Array.from(item).forEach(item => {
                comWords.push(item.getElementsByTagName("word")[0].childNodes[0].nodeValue);
            });

            comWords = comWords
                .map(word => word.replace(/\-|\^/g, ""))
                .filter(word => word.length > 1);

            return comWords[Math.floor(Math.random() * comWords.length)];
        });
}

function markInvalidInput() {
    input.value = "";
    input.style.outline = "1px solid red";
}

// 게임 초기화
initGame();
