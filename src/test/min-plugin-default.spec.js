define(['min!test/t1'], function(test) {

    describe('Checking if requirejs loads minified test with min plugin', function() {

        it('loaded test.js correctly', function() {
            expect(test).toEqual('minified');
        });

    });

});
