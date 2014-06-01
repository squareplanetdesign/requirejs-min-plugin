//----------------------------------------------------------------------
// These tests verify the plugin works with its defaults
//----------------------------------------------------------------------
define(['min!test/t1'], function(test) {

    describe('Checking if requirejs loads minified test with min plugin', function() {

        it('loaded test.js correctly', function() {
            expect(test).toEqual('minified');
        });

    });

});

define(['min!test/t3'], function(test) {

    describe('Checking if requirejs loads minified test with min plugin', function() {

        it('loaded test.js correctly', function() {
            expect(test).toEqual('minified');
        });

    });

});
