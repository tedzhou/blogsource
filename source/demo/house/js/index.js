//function startPlayMusic() {
//    0 === firstTaped && (audioEle.play(), firstTaped = 1)
//}
//function toggleMusic() {
//    audioEle.paused ? (speakerIcon.removeClass("speaker_muted"), audioEle.play()) : (speakerIcon.addClass("speaker_muted"), audioEle.pause())
//}
//function removeAnimation(a) {
//    var b = ".page-" + a;
//    $(b).removeClass("show")
//}
//function addAnimation(a) {
//    var b = ".page-" + a;
//    $(b).addClass("show"), setTimeout(function () {
//        $(".swipe-up_" + a).css("display", "block").addClass("swipeMove")
//    }, 2300)
//}
//function screenUp() {
//    pageNumber--;
//    var a, b;
//    0 > pageNumber && (pageNumber = 0), pageDistance = screenHeight * pageNumber, a = "translate3d(0, -" + pageDistance + "px, 0)", b = "all 0.5s ease-in", verticalList.css({"-webkit-transform": a, transform: a, "-webkit-transition": b, transition: b}), setTimeout(function () {
//        addAnimation(pageNumber), removeAnimation(pageNumber + 1)
//    }, 500), $(".swipe-up").css("display", "none").removeClass("swipeMove")
//}
//function screenDown() {
//    pageNumber++;
//    var a, b;
//    pageNumber > pageCount - 1 && (pageNumber = pageCount - 1), pageDistance = screenHeight * pageNumber, a = "translate3d(0, -" + pageDistance + "px, 0)", b = "all 0.5s ease-in", verticalList.css({"-webkit-transform": a, transform: a, "-webkit-transition": b, transition: b}), setTimeout(function () {
//        addAnimation(pageNumber), removeAnimation(pageNumber - 1)
//    }, 500), $(".swipe-up").css("display", "none").removeClass("swipeMove")
//}
//function startTouch(a) {
//    if (a.touches.length) {
//        tmpEndY = 0;
//        var b = a.touches[0];
//        tmpStartY = b.pageY
//    }
//}
//function moveTouch(a) {
//    if (a.preventDefault(), a.touches.length) {
//        var b = a.touches[0];
//        tmpEndY = b.pageY
//    }
//}
//function endTouch() {
//    var a = tmpEndY, b = tmpStartY;
//    a && a !== b && -50 >= a - b ? screenDown() : a && a !== b && a - b >= 50 && screenUp()
//}
//function scalePage(a) {
//    var b, c = screenWidth / screenHeight, d = 320 / 504;
//    b = c > d ? screenHeight / 504 : screenWidth / 320, $(a).css({"-webkit-transform-origin": "center", "transform-origin": "center", "-webkit-transform": "scale(" + b + ");", transform: "scale(" + b + ");"})
//}
//function showMain() {
//    screenHeight = window.innerHeight, screenWidth = window.innerWidth, scalePage(".page-content"), scalePage(".swipe-up"), $(".content-li").css("height", screenHeight), verticalList.on("touchstart", function (a) {
//        startTouch(a)
//    }), verticalList.on("touchmove", function (a) {
//        moveTouch(a)
//    }), verticalList.on("touchend", function (a) {
//        endTouch(a)
//    }), $("html").on("touchstart", startPlayMusic), speakerEle.on("tap", toggleMusic), addAnimation(0)
//}
//var pageNumber = 0, pageDistance = 0, tmpStartX, tmpStartY, tmpEndX, tmpEndY, screenHeight, screenWidth, verticalList = $(".content-list"), firstTaped = 0, audioEle = document.querySelector("audio"), speakerEle = $(".speaker-wrap"), speakerIcon = $(".speaker");