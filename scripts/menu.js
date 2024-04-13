function toggleMenu(){
    if ($("#menu").css("width") === "0px") {
        if (window.innerHeight > window.innerWidth) {
            $("#header").animate({"opacity": "0%"});
            $("#content").animate({"opacity": "0%"});
            $("#menu").animate({"width": "100%"});
        } else {
            $("#header").animate({"width": `${window.innerWidth-256}px`, "opacity": "50%"});
            $("#content").animate({"width": `${window.innerWidth-256}px`, "opacity": "50%"});
            $("#menu").animate({"width": "256px"});
        }
    } else {
        $("#header").animate({"width": "100%", "opacity": "100%"});
        $("#content").animate({"width": "100%", "opacity": "100%"});
        $("#menu").animate({"width": "0%"});
    }
}

$(function(){
    $("#header-menu-button").click(toggleMenu);
    $("#menu-exit-button").click(toggleMenu);
});