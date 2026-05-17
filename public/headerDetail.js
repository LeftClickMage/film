document.write(`
    
    <!-- Nav Code -->
    <script src="/public/navigation/homeNav.js?version=1.0.0"></script>
    <script src="/public/downtime.js"></script>


    <!-- Background Code-->
    <img id="backgroundPoster" src="/public/backgrounds/anamorphicBackground.jpg" style="z-index:-999;">
    <video autoplay muted loop id="backgroundVideo" style="z-index:-1000;">
        <source src="https://elcmbucket.ethantwu.com/anamorphicBackground.mp4" type="video/mp4">
    </video>
    <link rel="stylesheet" href="/public/backgrounds/background.css">
    <script src="/public/backgrounds/index.js?version=1.0.0"></script>

    <script>
    (function(){
        var poster = document.getElementById("backgroundPoster");
        var video = document.getElementById("backgroundVideo");
        function fadeOutPoster(){
            poster.style.opacity = "0";
        }
        if(video.readyState >= 3){
            fadeOutPoster();
        } else {
            video.addEventListener("canplay", fadeOutPoster, { once: true });
        }
    })();
    </script>

`);

function createMainTitle(title, belowContent){
    document.write(`
        <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;">
            <div class="container-md text-center">
                <h1 class="slide slide-in-title-175 display-massive fw-bold text-white text-center glowWhite mb-4" id="elcmTitle" style="opacity:0;">` + title + `</h1>
                ` + (belowContent || "") + `
            </div>
        </div>
    `);
}

function createWebsiteTitle(title){
    document.write(`
        <div class="d-flex align-items-center" style="min-height: clamp(35vh, 40vw, 45vh);">
            <div class="container-md text-center mt-5">
                <h1 class="slide slide-in-title-175 display-massive fw-bold text-white text-center glowWhite" style="opacity:0;">` + title + `</h1>
            </div>
        </div>
    `);
}

function createMainText(text){
    document.write(`
        <div class="container my-5">
            <p class="h1 text-light mb-0">` + text + `</p>
        </div>
    `);
}

function createButton(text, link, delay){
    delay = delay == null ? 250 : delay;
    return `
        <a href="` + link + `" class="slide slide-from-bottom-` + delay + ` btn btn-outline-light btn-lg px-4 py-2 mx-2 fs-4">
            ` + text + `
        </a>
    `;
}

function createButtonRow(...buttons){
    return `
        <div class="d-flex justify-content-center flex-wrap gap-2">
            ` + buttons.join("") + `
        </div>
    `;
}