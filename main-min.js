require(["min!app"], function(app) {
    // Alternative minified version
    var el = document.getElementById("do");
    el.innerHTML = "Done Loading!!!";
    app.go(); 

    return function(){
        console.log("called main.");
    };   
});