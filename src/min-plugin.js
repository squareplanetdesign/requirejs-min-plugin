/*global requirejs: false, define: false, console: false */

/**
 * The min plugin module is used with require js to extend its functionality
 * to support fallback loading of minimzed and non-minmized versions of the
 * same resources. The plugin is designed to help speed up development in these
 * kinds of enviornments in that it will fall back to the non-minimzed version
 * automatically if you have not defined any configuration or run your code
 * minimizer yet.
 *
 * @module min
 * @example
 *
 * require(["min!app"], function(app) {
 *      // code
 * });
 *
 * Will load app.min.js if its available, or app.js if app.min.js fails to load.
 *
 */

// The MIT License (MIT)
//
// Copyright (c) 2014 Thomas Green
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software
// is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function() {

    // Constants
    var defaultExtension = ".min";


    define({

        /**
         * Load the correct version of the library based on the configuration and the
         * fallback rules. Attempts to load the minimized verion of the library first
         * if the config.debug flag is not defined or is false. Loads the non-minimized
         * version of the library if either the config.debug is true or the minimized
         * version of the libaray fails to load from the server.
         * @param  {String} name     Name of the module to attempt to load.
         * @param  {Function} req    Current require() reference for this request.
         * @param  {Function} onload Function callback to call on sucessfull load.
         * @param  {Object} config   Current require js configuration.
         *   @param  {Object} config.min   Min plugin configuration.
         *     @param  {Boolean} config.min.debug   If true, will load the non-minimized version,
         *     otherwise will load the minimized verions of the resource.
         *     @param  {Boolean} config.min.extension Extension to add the the module name for
         *     the minimized file before the .js extension.
         *     @param  {Boolean} config.min.format Formatting function applied to the name before
         *     the extension processing. Only applied to the minimized request.
         */
        load: function (name, req, onload, config) {
            debugger;
            if(!config.min) {
                config.min = {
                    extension : defaultExtension
                };
            } else {
                if (!config.min.extension) {
                    config.min.extension = defaultExtension;
                }
            }

            var minName = name;
            // Extent the name with the .min
            if (!config.min.debug) {
                if (config.min.format) {
                    minName = config.min.format(minName);
                }
                minName += config.min.extension;
            }

            req([minName],
                function(value) {
                    debugger;
                    onload(value);
                },
                function (err) {
                    debugger;
                // Handle graceful fall-back to the non-minified version
                var failedId = err.requireModules && err.requireModules[0];
                if (failedId) {
                    requirejs.undef(failedId);
                    // fall back to the non-minified version
                    req([name], onload, function(err) {
                        // No version of the file is available so just fail out.
                        var failedId = err.requireModules && err.requireModules[0];
                        if (failedId) {
                            requirejs.undef(failedId);
                        }
                        console.log ("Could not load either " + minName + " or " + name + " dependencies.");
                    });
                }
            });
        }
    });

})();
