var slideObjects = document.querySelectorAll('.slide');
for (var object of slideObjects){
    object.style.opacity = 0;
    var customClass = object.classList[1];
    customClass = customClass.split("-");
    classType = customClass[2];
    classDelay = customClass[3];
    object.style.animationDelay = classDelay + "ms";
    object.classList.add("slide-in-" + classType);
}