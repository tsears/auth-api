const log = require('../../app/log').Log;

describe('log', () => {
    it('logs when data is present', () => {
        const oldLog = console.log;
        let result;
        console.log = (a, b) => { result = { message: a, data: b}};
        log('foo', 'bar', 'baz', { qux: 1 });

        expect(result.message).toMatch(/\[[\d-T:\.Z]+\]\[foo\]\[bar\]: baz/);
        expect(result.data).toEqual({ qux: 1});

        console.log = oldLog;
    });

    it('logs when data is absent', () => {
        const oldLog = console.log;
        let result;
        console.log = (a, b) => { result = { message: a, data: b}};
        log('foo', 'bar', 'baz');

        expect(result.message).toMatch(/\[[\d-T:\.Z]+\]\[foo\]\[bar\]: baz/);
        expect(result.data).toEqual('');

        console.log = oldLog;
    });
});
