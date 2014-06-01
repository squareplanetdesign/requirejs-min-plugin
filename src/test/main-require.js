var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/require\.spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    enforceDefine: true,

    // Karma serves files from '/base'
    baseUrl: "/base/src",

    paths: {
        min           : "min-plugin",
        "test/t2.min" : [
            "test/t2.min",
            "test/undef"
        ],
        "test/t3"     : [
            "test/t3",
            "test/undef"
        ]
    },

    waitSeconds: 2000,

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
