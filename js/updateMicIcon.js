const updateMicIcon = (isListening) => {
    const icon = document.getElementById('questionIcon');
    const currentUrl = window.location.href;
    const micIconPath = currentUrl.includes("index.html") ? './img/' : '../img/';
    icon.src = micIconPath + (isListening ? 'mic.gif' : 'mic_none.png');
};