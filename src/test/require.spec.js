//----------------------------------------------------------------------
// These tests verify the plugin doesn"t interfer with require.js
// default behavior
//----------------------------------------------------------------------

/*requirejs.onError = function(err) {
    debugger;

    console.log("RequireJS Error Detected:");
    console.log("Type:    " + err.requireType);
    if (err.requireModules) {
        console.log("Modules: " + err.requireModules);

        for (var i = 0, l = err.requireModules.length; i < l; i++ ) {
            var module = err.requireModules[i];
            if (module &&
                (/^test\/t2\.min$/.test(module) ||
                 /^test\/t3$/.test(module))) {
                    requirejs.undef(module);
                    define(module, [], function() {
                        debugger;
                        return "";
                    });
            }
        }
    }
};*/

define(
    ["test/t1", "test/t1.min", "test/t2", "test/t2.min", "test/t3", "test/t3.min"],
    function(t1, t1min, t2, t2min, t3, t3min) {
        debugger;
        console.log("1");
        describe("Checking if requirejs loads t1.js", function() {

            it("loaded t1.js correctly", function() {
                expect(t1).toEqual("normal");
            });

        });

        console.log("2");
        describe("Checking if requirejs loads t1.min", function() {

            it("loaded t1.min.js correctly", function() {
                expect(t1min).toEqual("xminified");
            });

        });

        console.log("3");
        describe("Checking if requirejs loads t2.js", function() {

            it("loaded t2.js correctly", function() {
                expect(t2).toEqual("normal");
            });

        });

        debugger;
        console.log("4");
        describe("Checking if requirejs fails to load t2.min.js", function() {

            it("failed to load t2.min.js correctly since it not on the disk.", function() {
                expect(t2min).toEqual("");
            });

        });

        debugger;
        console.log("5");
        describe("Checking if requirejs fails to load t3.js", function() {

            it("failed to load t3.js correctly since it not on the disk.", function() {
                expect(t3).toEqual("");
            });

        });

        console.log("6");
        describe("Checking if requirejs loads t3.min.js", function() {

            it("loaded t3.min.js correctly", function() {
                expect(t3min).toEqual("normal");
            });

        });
    }
);
