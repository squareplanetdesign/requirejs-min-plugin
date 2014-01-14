var require = {
        baseUrl: "",
        min : {
            debug: false,
            extension: ".min",
            format: function(name) {
                return name.replace(/(.*)/, ".generated/$1");
            }
        },
        paths: {
            underscore: "underscore.min",
        },
        shim: {
            "underscore": {
                exports: "_"
            }
        }
    };
