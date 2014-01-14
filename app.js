define(["underscore", "min!sub"], function(_, sub) {
    return {
        go : function() {
            var el = document.getElementById("go");
            el.innerHTML = sub.format("Go is done loading!!!");
            //el.innerHTML = "Go is done loading!!!";
        }
    };
});
