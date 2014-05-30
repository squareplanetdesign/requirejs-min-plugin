var require = {
        baseUrl: ".",
        waitSeconds: 10000,
        min : {
            debug: false,
            extension: ".min",
            format: function(name) {
                return name.replace(/(.*)/, ".generated/$1");
            }
        },
        paths: {
            underscore: "underscore",
        },
        shim: {
            "underscore": {
                exports: "_"
            }
        }
    };
