var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/min-plugin-default-debug\.spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

debugger;

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: "/base/src",

    paths: {
        min: "min-plugin"
    },

    min: {
        debug: true
    },

    waitSeconds: 2000,

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
