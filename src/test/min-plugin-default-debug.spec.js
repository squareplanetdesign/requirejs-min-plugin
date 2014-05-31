define(['min!test/t1'], function(test) {

    debugger;
    describe('Checking if requirejs loads non-minified test with min plugin in debug mode', function() {

        it('loaded t1.js correctly', function() {
            expect(test).toEqual('normal');
        });

    });

});
