const startWords = ["우리말", "끝말잇기", "게임"];
const index = Math.floor(Math.random() * 3);
let word = startWords[index];

const keyWord = document.querySelector(".keyWord");
let time = 10;
const timeZone = document.querySelector(".timeZone");
const input = document.querySelector("#word");
const pointZone = document.querySelector("#point");
const timerFill = document.getElementById("timer-fill");
let point = 0;

keyWord.innerHTML = word;
pointZone.innerHTML = point;
input.focus();

const timeCheck = () => {
    timeZone.innerHTML = time;
    const timerPercentage = (time / 10) * 100; // 타이머의 백분율 계산
    timerFill.style.width = `${timerPercentage}%`; // 막대 그래프의 너비 설정
    if (time === 0) {
        clearInterval(start);
        input.setAttribute("disabled", true);
        alert(`Game Over \npoint : ${point}`);
        setTimeout(() => {
            location.href = location.href;
        }, 1000); // 1초 후에 페이지 새로고침
    } else {
        time -= 1;
    }
};

timeCheck();
let start = setInterval(timeCheck, 1000);

const apiKey = "D857D92EE2FC749494BF756C5B793649";

let timeout = null;

input.addEventListener("input", function () {
    clearTimeout(timeout); // 입력이 있을 때마다 기존 타이머를 초기화하여 지연시간을 재설정합니다.

    timeout = setTimeout(() => {
        const prevWord = keyWord.innerHTML;
        word = this.value;

        clearInterval(start);

        if (word.length > 1 && HanTools.dueum(prevWord[prevWord.length - 1]) === word[0]) {
            fetch(`https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${word}&advanced=y&method=exact`)
                .then((res) => {
                    return res.text();
                })
                .then((data) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, "text/xml");

                    const result = xmlDoc.getElementsByTagName("total")[0].childNodes[0].nodeValue;

                    if (result > 0) {
                        input.value = "";
                        input.style.outline = "";
                        time = 10;

                        point = point + word.length * 10;
                        pointZone.innerHTML = point;

                        fetch(
                            `https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${HanTools.dueum(
                                word[word.length - 1]
                            )}&advanced=y&sort=popular&type1=word&method=start&num=100`
                        )
                            .then((res) => {
                                return res.text();
                            })
                            .then((comData) => {
                                const comXmlDoc = parser.parseFromString(comData, "text/xml");
                                const item = comXmlDoc.getElementsByTagName("item");

                                let comWord = [];

                                Array.from(item).forEach((item) =>
                                    comWord.push(item.getElementsByTagName("word")[0].childNodes[0].nodeValue)
                                );

                                comWord = comWord
                                    .map((word) => word.replace(/\-|\^/g, ""))
                                    .filter((word) => word.length > 1);

                                keyWord.innerHTML = comWord[Math.floor(Math.random() * comWord.length)];

                                timeCheck();
                                start = setInterval(timeCheck, 1000);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        input.value = "";
                        input.style.outline = "1px solid red";
                        start = setInterval(timeCheck, 1000);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            input.value = "";
            input.style.outline = "1px solid red";
            start = setInterval(timeCheck, 1000);
        }
    }, 500); // 0.5초의 딜레이를 줘서 입력의 완료를 감지합니다.
});
