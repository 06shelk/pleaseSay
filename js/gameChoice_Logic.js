// 클릭이벤트 처리
function lastWord() {
    window.location.href = "../html/lastWordRule.html";
}

function pron() {
    window.location.href = "../html/pronRule.html";
}



window.addEventListener('DOMContentLoaded', function() {
    const endGame = document.querySelector('.endGame');
    const pronGame = document.querySelector('.PronGame');

    function handleMouseOver(element) {
        element.style.width = '800px';
        element.style.color = '#FF4242';
        element.style.borderColor = '#FF4242';
    }

    function handleMouseOut(element) {
        element.style.fontSize = '';
        // element.style.width = '600px';
        element.style.borderColor = '#ffffff';
        element.style.color = '#ffffff';
    }

    // endGame에 마우스를 올렸을 때의 이벤트 처리
    endGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        pronGame.style.width = '600px';
        pronGame.style.color = 'black';
        pronGame.style.borderColor = 'black';
    });

    endGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        pronGame.style.width = '800px';
        pronGame.style.color = '';
        pronGame.style.borderColor = '#ffffff';
    });

    // PronGame에 마우스를 올렸을 때의 이벤트 처리
    pronGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        endGame.style.width = '600px';
        endGame.style.color = 'black';
        endGame.style.borderColor = 'black';
    });

    pronGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        endGame.style.width = '800px';
        endGame.style.color = '';
        endGame.style.borderColor = '#ffffff';
    });
});
