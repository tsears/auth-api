const indexRoutes = require('../../app/routes');

describe('routes/index', () => {
    it('registers auth routes', () => {
        const authSpy = createSpyObj('auth', ['configure']);
        const RouterSpy = createSpy('Router');
        const routerSpy = createSpyObj('router', ['add']);

        RouterSpy.andReturn(routerSpy);

        authSpy.configure.andReturn('foo');

        indexRoutes(RouterSpy, authSpy, 'bar', 'baz');

        expect(routerSpy.add).toHaveBeenCalledWith('/auth', 'foo');
        expect(authSpy.configure).toHaveBeenCalledWith(RouterSpy, 'bar', 'baz');
    });
});
