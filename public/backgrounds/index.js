xBackground = 0;
yBackground = 0;
document.addEventListener('mousemove', (event) => {
    xBackground = -event.clientX/100;
    yBackground = -event.clientY/100;
});

backgroundVideo = document.getElementById('backgroundVideo');

function updateBackground(){
    
    backgroundVideo.style.left = xBackground + "px";
    backgroundVideo.style.top = yBackground + "px";
    window.requestAnimationFrame(updateBackground);
}

updateBackground();