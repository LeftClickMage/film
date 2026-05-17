document.write(`
    <style>
        @keyframes fadeInNavbar{
            from {
                opacity:0%;
                transform: rotate(180deg) scale(0);
            }
            to{
                opacity:100%;
                transform: rotate(360deg) scale(1);
            }
        }
        @keyframes fadeOutNavbar{
            from {
                opacity:100%;
                transform: rotate(0deg) scale(1);
            }
            to{
                opacity:0%;
                transform: rotate(180deg) scale(0);
            }
        }
            
            .font-increase-2x{
                  font-size:150%;
            }

            #navigationBar{
                  background-color:rgba(0, 0, 0, 0.3);
                  transition: background-color 400ms;
                  z-index: 10000;
                  backdrop-filter: blur(5px);

            }
            #navigationBar:hover{
                  background-color:rgba(0,0,0,0.75);
                  transition: background-color 500ms;
            }
      
            .homeLogoNavbar{
                  transition:0.3s;
            }
            .homeLogoNavbarActive{
                filter: drop-shadow(0px 0px 5px #FFF);
            }

            .homeLogoNavbar:hover{
                  -webkit-filter: drop-shadow(0px 0px 5px #FFF);
                  filter: drop-shadow(0px 0px 5px #FFF);
                  cursor:pointer;
            }

            .fadeInNavbar {
                  animation: fadeInNavbar 0.25s ease-in-out forwards; 
            }
            .fadeOutNavbar {
                  animation: fadeOutNavbar 0.25s ease-in-out forwards; 
            }
            .linkText{
                color: rgba(255, 255, 255, 0.6);
                letter-spacing: 0px;
                transition: color 300ms;
                transition: color 300ms, letter-spacing 300ms;
            }
            .linkText:hover{
                color: rgba(255, 255, 255, 1);
                letter-spacing: 0.5px;
                transition: color 300ms, letter-spacing 300ms;
            }
            .nav-link.active .linkText{
                color: rgba(255, 255, 255, 1);
                letter-spacing: 0.5px;
            }
      </style>

    <nav class="border border-5 border-dark border-top-0 border-start-0 border-end-0 navbar navbar-expand-md navbar-dark p-0 m-0 position-fixed top-0 w-100" id="navigationBar" style="overflow:visible !important;">
        <div class="container-fluid" style="overflow:visible !important;">
            <a id="linkLogoNavbar" class="rounded-circle border border-3 border-dark homeLogoNavbar m-1 me-2 my-2" href="/index.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home" style="overflow:visible !important;">
                <img src="/public/logos/EthanTwuLogoCircle.png" width="75px" class = "" style="overflow:visible !important; padding:10px; margin:-10px;">
            </a>

            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="false" aria-label="Toggle navigation" id="testing" style="overflow:visible !important;  user-select:none; -ms-user-select: none; -webkit-user-select: none; ">
                <img src="/public/navigation/navbarOpen.png" class="pixelArt homeLogoNavbar" width = "80px" id="navbarToggler" style="overflow:visible !important; padding:10px; margin:-10px; user-select:none;-ms-user-select: none; -webkit-user-select: none; ">
            </button>

      
            <div class="navbar-collapse collapse text-center" id="collapse">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/verticalcontent.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Vertical Content" id="verticalcontent"><span class="linkText">VERTICAL CONTENT</span></a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="/shortfilms.html" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan's Short Films" id="shortfilms"><span class="linkText">SHORT FILMS</span></a>
                    </li>
                    
                </ul>
                <ul class="navbar-nav ms-auto me-md-2 align-items-md-center">
                    <li class="nav-item">
                        <a class="nav-link font-increase-2x" href="https://ethantwu.com" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ethan Twu's Main Page" id="mainpage"><span class="linkText">MAIN PAGE</span></a>
                    </li>
                </ul>
                <ul class="navbar-nav me-1 mb-3 mb-md-0">
                    <a href="mailto:elcm@ethantwu.com" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Social Media" ><button class="btn btn-danger fs-4">CONTACT</button></a>
                </ul>
            </div>

        </div>
    </nav>


`);



var pathName = window.location.pathname;
if (pathName == "/index.html" || pathName == "/"){
    document.getElementById("linkLogoNavbar").classList.add("homeLogoNavbarActive");
}

document.querySelectorAll("#collapse .nav-link").forEach(link => {
    var linkPath = new URL(link.href).pathname;
    if (linkPath === pathName) {
        link.classList.add("active");
    }
});

var toggler = document.getElementById("navbarToggler");
var navbarCollapse = document.getElementById('collapse');

var readyToSetNavbarIcon = true;
var navbarExpanded;

function changeRotation(){
    
    if(navbarCollapse.classList.contains('show') && readyToSetNavbarIcon){
        navbarExpanded = true;
        setNavbarIconType("closed");
    } else if (readyToSetNavbarIcon) {
        navbarExpanded = false;
        setNavbarIconType("open");
    }
    
    requestAnimationFrame(changeRotation);
}


changeRotation();

async function fadingNavbar(value){
    toggler.classList.remove('fadeInNavbar');
    toggler.classList.add('fadeOutNavbar');
    await downtime(350);
    readyToSetNavbarIcon = true;
    
    setNavbarIconType(value);
  
    toggler.classList.remove('fadeOutNavbar');
    toggler.classList.add('fadeInNavbar');
}

function setNavbarIconType(value){
  if(value == "open"){
    toggler.src = "/public/navigation/navbarOpen.png";
  } else if (value == "closed") {
    toggler.src = "/public/navigation/navbarClose.png";
  }
}


document.getElementById("navbarToggler").addEventListener("click", (event)=>{
    readyToSetNavbarIcon = false;
    if(!navbarExpanded){
        fadingNavbar("closed");
    } else {
        fadingNavbar("open");
    }
});