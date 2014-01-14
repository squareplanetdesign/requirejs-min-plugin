define({
    load: function (name, req, onload, config) {
        var minName = name;
        // Extent the name with the .min
        if (!config.debug) {
            minName += ".min";
        }

        req([minName], onload, function (err) {
            // Handle gracefule fallback to the unminified version
            var failedId = err.requireModules && err.requireModules[0];
            if (failedId) {
                requirejs.undef(failedId);
                // fall back to the non-minififed version
                req([name], onload, function(err) {
                    // Handle gracefule fallback to the unminified version
                    var failedId = err.requireModules && err.requireModules[0];
                    if (failedId) {
                        requirejs.undef(failedId);
                    }
                    console.log ("Could not load either " + minName + " or " + name + " dependenices.");
                });
            }
        });
    }
});
