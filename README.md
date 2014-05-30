requirejs-min-plugin
=========================================


Contains a plugin for require.js plugin that allows the developer to provide a fallback for .min files if they are not yet generated on the server.  The fallback logic can be reversed for development enviornments with the debug config flag.

Roadmap
=========================================
After working with a few other projects with grunt and karma, I decided to reorganize this project to have a build and test enviornment. Some of the ground work is laid, but its not fully functional yet. Please have patience.

How it works?
=========================================



Sample application without the plugin
=========================================

Lets start out with the following application directory layout:

    app/
        index.html
        require.js
        main.js
        module1.js

Where index.html:

    <!DOCTYPE html>
    <html>
        <head>
            <script>
                require = {
                };
            </script>
            <script data-main="main" src="require.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>

main.js is:

    require(["module1"], function(app) {
        // code
    });

and module1.js is:

define([], function(){
    // do something else
});

Run your applicaiton an you should see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/main.js
    http://localhost/module1.js 


Addin the plugin to your application
=========================================

Next drop the min.js plugin file in the same folder:

    app/
        index.html
        require.js
        main.js
        min.js
        module1.js

And add the plugin to the files for your application:

index.html:

    <!DOCTYPE html>
    <html>
        <head>
            <script>
                require = {
                };
            </script>
            <script data-main="min!main" src="require.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>

main.js is:

    require(["min!module1"], function(app) {
        // code
    });


Run your application and you will load app.js and module1.js in your application.  Unfortunatly you will also see 2 errors in your console:

    "NetworkError: 404 Not Found - http://localhost/app.min.js"
    "NetworkError: 404 Not Found - http://localhost/module1.min.js"

You will see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/main.min.js - 404
    http://localhost/main.js - 
    http://localhost/module1.min.js - 404
    http://localhost/module1.js 

but the application still works as expected.

Now lets run our javascript minimifier so we now have:

    app/
        index.html
        require.js
        main.js
        main.min.js
        min.js
        module1.js
        module1.min.js

Loading your application now results in the minified files being loaded.

You will see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/main.min.js
    http://localhost/module1.min.js


Forcing your application to load debug versions of the files
===============================================================

Next lets change the config to force it to load the debug versions of the files.

To do this just add the debug flag to the require js configuration as follows:

index.html:

    <!DOCTYPE html>
    <html>
        <head>
            <script>
                require = {
                    min : {
                        debug : true
                    }
                };
            </script>
            <script data-main="min!main" src="require.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>

Loading your application now results in the debug files being loaded.

You will see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/main.js
    http://localhost/module1.js


Changing the extension:
===============================================================

Next lets change the config to load minized files with a different extension.

To do this just add the extension to the require js configuration as follows:

index.html:

    <!DOCTYPE html>
    <html>
        <head>
            <script>
                require = {
                    min : {
                        extension : "-min"
                    }
                };
            </script>
            <script data-main="min!main" src="require.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>

Loading your application now results in the debug files being loaded.

You will see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/main-min.js
    http://localhost/module1-min.js


Changing the path to request for the minimized version:
===============================================================

Finally lets change the config to load minized files with a different extension.

To do this just add the extension to the require js configuration as follows:

index.html:

    <!DOCTYPE html>
    <html>
        <head>
            <script>
                require = {
                    min : {
                        format : function(name) {
                            return name.replace(/(.*)/, ".generated/$1");
                        }
                    }
                };
            </script>
            <script data-main="min!main" src="require.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>

Loading your application now results in the debug files being loaded.

You will see the following requests on your network:

    http://localhost/index.html
    http://localhost/require.js
    http://localhost/.generated/main.min.js
    http://localhost/.generated/module1.min.js


