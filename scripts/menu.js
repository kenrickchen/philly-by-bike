$(function(){
    $("#header-menu-button").click(function(){
        if ($("#page").css("right") === "0px") {
            $("#page").animate({"right": "360px"});
            $("#menu").animate({"right": "0px"});
        } else {
            $("#page").animate({"right": "0px"});
            $("#menu").animate({"right": "-360px"});
        }
    });
});