$(function(){
    $("#header-menu-button").click(function(){
        if ($("#content").css("right") === "0px") {
            $("#header").animate({"width": "75%"});
            $("#content").animate({"width": "75%"});
            $("#menu").animate({"width": "25%"});
        } else {
            $("#header").animate({"width": "100%"});
            $("#content").animate({"width": "100%"});
            $("#menu").animate({"width": "0%"});
        }
    });
});