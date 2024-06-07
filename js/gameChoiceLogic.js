// 클릭이벤트 처리
function lastWord() {
    window.location.href = "http://localhost/pleaseSay/php/lastWordRank.php";
}

function pron() {
    window.location.href = "http://localhost/pleaseSay/php/pronRank.php";
}



window.addEventListener('DOMContentLoaded', function() {
    const endGame = document.querySelector('.endGame');
    const pronGame = document.querySelector('.PronGame');

    function handleMouseOver(element) {
        element.style.fontSize = '100px';
        element.style.width = '500px';
        element.style.color = '#FF4242';
        element.style.border = '#FF4242 3px solid';
    }

    function handleMouseOut(element) {
        element.style.fontSize = '';
        element.style.width = '800px';
        element.style.border = '#ffffff 3px solid';
        element.style.color = '#ffffff';
    }

    // endGame에 마우스를 올렸을 때의 이벤트 처리
    endGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        pronGame.style.color = 'black';
        pronGame.style.border = 'black 3px solid';
    });

    endGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        pronGame.style.color = '';
        pronGame.style.border = '#ffffff 3px solid';
    });

    // PronGame에 마우스를 올렸을 때의 이벤트 처리
    pronGame.addEventListener('mouseover', function() {
        handleMouseOver(this);
        endGame.style.color = 'black';
        endGame.style.border = 'black 3px solid';
    });

    pronGame.addEventListener('mouseout', function() {
        handleMouseOut(this);
        endGame.style.color = '';
        endGame.style.border = '#ffffff 3px solid';
    });
});
