define(['test/t1'], function(test) {
    describe('Checking if requirejs loads normal test', function() {

        it('loaded t1.js correctly', function() {
            expect(test).toEqual('normal');
        });

    });

});

define(['test/t1.min'], function(test) {

    describe('Checking if requirejs loads minified test', function() {

        it('loaded t1.min.js correctly', function() {
            expect(test).toEqual('xminified');
        });

    });

});
