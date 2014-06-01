/* jshint quotmark:single */

var markdown = require('node-markdown').Markdown;

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-ngdocs');

    // Project configuration.
    grunt.util.linefeed = '\n';

    grunt.initConfig({
        modules: [], //to be filled in by build task
        pkg: grunt.file.readJSON('package.json'),
        dist: 'dist',
        srcfilename : 'min-plugin',
        filename: 'requirejs-min-plugin',
        meta: {
            banner: ['/*',
                     ' * <%= pkg.name %>',
                     ' * <%= pkg.homepage %>\n',
                     ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                     ' * License: <%= pkg.license %>',
                     ' */\n'].join('\n')
        },
        delta: {
            js: {
              files: ['src/*.js'],
              tasks: ['karma:watch:run']
            }
        },
        copy: {
            dist: {
                options: {
                    banner: '<%= meta.banner %><%= meta.modules %>\n'
                },
                files: [
                    // includes files within path
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/',
                        src: ['*.js'],
                        dest: '<%= dist %>/',
                        filter: 'isFile'
                    },
                ]
            }
        },
        rename: {
            dist: {
                files: [
                    {
                        src: ['<%= dist %>/<%= srcfilename %>.js'],
                        dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
                    }
                ]
          }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist:{
                src:['<%= dist %>/<%= filename %>-<%= pkg.version %>.js'],
                dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js','src/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        karma: {
            /*'test-require': {
                configFile: 'karma.require.conf.js'
            },*/
            'test-min-plugin-default': {
                configFile: 'karma.min-plugin-default.conf.js'
            },
            'test-min-plugin-default-debug': {
                configFile: 'karma.min-plugin-default-debug.conf.js'
            },
            watch: {
               background: true
            },
            continuous: {
               singleRun: true
            },
            jenkins: {
               singleRun: true,
               colors: false,
               reporters: ['dots', 'junit'],
               browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Opera', '/Users/jenkins/bin/safari.sh']
            },
            travis: {
               singleRun: true,
               reporters: ['dots'],
               browsers: ['Firefox']
            },
            coverage: {
                preprocessors: {
                    'src/*.js': 'coverage'
                }
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                templateFile: 'misc/changelog.tpl.md',
                github: 'squareplanetdesign/requirejs-min-plugin'
            }
        },
        shell: {
            //We use %version% and evluate it at run-time, because <%= pkg.version %>
            //is only evaluated once
            'release-prepare': [
                'grunt before-test after-test',
                'grunt version', //remove "-SNAPSHOT"
                'grunt changelog'
            ],
            'release-complete': [
                'git commit CHANGELOG.md package.json -m "release: v%version%"',
                'git tag %version%'
            ],
            'release-start': [
                'grunt version:minor:"SNAPSHOT"',
                'git commit package.json -m "release: Starting v%version%"'
            ]
        }
    });

    //register before and after test tasks so we've don't have to change cli
    //options on the goole's CI server
    grunt.registerTask('before-test', ['jshint']);
    grunt.registerTask('after-test', ['build']);

    //Rename our watch task to 'delta', then make actual 'watch'
    //task build things, then start test server
    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['before-test', 'after-test', 'karma:watch', 'delta']);

    // Default task.
    grunt.registerTask('default', ['before-test', 'test', 'after-test']);


    grunt.registerTask('dist', 'Override dist directory', function() {
        var dir = this.args[0];
        if (dir) {
            grunt.config('dist', dir);
        }
    });

    grunt.registerTask('build', 'Create build files', function() {
        grunt.task.run(['copy', 'rename', 'uglify']);
    });

    grunt.registerTask('test', 'Run tests on singleRun karma server', function () {
        /*//this task can be executed in 3 different environments: local, Travis-CI and Jenkins-CI
        //we need to take settings for each one into account
        if (process.env.TRAVIS) {
            grunt.task.run('karma:travis');
        } else {
            var isToRunJenkinsTask = !!this.args.length;
            if(grunt.option('coverage')) {
                var karmaOptions = grunt.config.get('karma.options'),
                    coverageOpts = grunt.config.get('karma.coverage');
                grunt.util._.extend(karmaOptions, coverageOpts);
                grunt.config.set('karma.options', karmaOptions);
            }
            grunt.task.run(this.args.length ? 'karma:jenkins' : 'karma:continuous');
        }*/

        grunt.task.run('karma:test-min-plugin-default');
        grunt.task.run('karma:test-min-plugin-default-debug');
    });

    function setVersion(type, suffix) {
        var file = 'package.json';
        var VERSION_REGEX = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)(-\w+)*([\'|\"])/;
        var contents = grunt.file.read(file);
        var version;
        contents = contents.replace(VERSION_REGEX, function(match, left, center) {
            version = center;
            if (type) {
                version = require('semver').inc(version, type);
            }

            //semver.inc strips our suffix if it existed
            if (suffix) {
                version += '-' + suffix;
            }
            return left + version + '"';
        });
        grunt.log.ok('Version set to ' + version.cyan);
        grunt.file.write(file, contents);
        return version;
    }

    grunt.registerTask('version', 'Set version. If no arguments, it just takes off suffix', function() {
        setVersion(this.args[0], this.args[1]);
    });

    grunt.registerMultiTask('shell', 'run shell commands', function() {
        var self = this;
        var sh = require('shelljs');
        self.data.forEach(function(cmd) {
            cmd = cmd.replace('%version%', grunt.file.readJSON('package.json').version);
            grunt.log.ok(cmd);
            var result = sh.exec(cmd,{silent:true});
            if (result.code !== 0) {
                grunt.fatal(result.output);
            }
        });
    });

    return grunt;
};
