const indexRoutes = require('../../app/routes');

describe('routes/index', () => {
    it('registers auth routes', () => {
        const authSpy = createSpyObj('auth', ['configure']);
        const routerSpy = createSpyObj('router', ['add']);

        authSpy.configure.andReturn('foo');

        indexRoutes(routerSpy, authSpy, 'bar', 'baz');

        expect(routerSpy.add).toHaveBeenCalledWith('/auth', 'foo');
        expect(authSpy.configure).toHaveBeenCalledWith(routerSpy, 'bar', 'baz');
    });
});
