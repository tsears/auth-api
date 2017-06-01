const log = require('../../app/log').Log;

describe('log', () => {
    it('logs...', () => {
        const oldLog = console.log;
        let result;
        console.log = (a, b) => { result = { message: a, data: b}};
        log('foo', 'bar', 'baz', { qux: 1 });

        expect(result.message).toMatch(/\[[\d-T:\.Z]+\]\[foo\]\[bar\]: baz/);
        expect(result.data).toEqual({ qux: 1});

        console.log = oldLog;
    });
});
