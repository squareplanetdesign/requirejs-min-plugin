require(["min!app"], function(app) {
    var el = document.getElementById("do");
    el.innerHTML = "Done Loading!!!";    
    app.go(); 
    
    return function(){
        console.log("called main.");
    };   
});