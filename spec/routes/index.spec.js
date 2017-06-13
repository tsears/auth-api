const indexRoutes = require('../../app/routes');

describe('routes/index', () => {
    it('registers auth routes', () => {
        const authSpy = jasmine.createSpyObj('authRoutes', ['configure']);
        const RouterSpy = jasmine.createSpy('Router');
        const routerSpy = jasmine.createSpyObj('router', [
            'use',
        ]);

        RouterSpy.and.returnValue(routerSpy);

        authSpy.configure.and.returnValue('foo');

        indexRoutes.__Rewire__('Router', RouterSpy);
        indexRoutes.__Rewire__('authRoutes', authSpy);

        indexRoutes('bar');

        expect(routerSpy.use).toHaveBeenCalledWith('/auth', 'foo');
        expect(authSpy.configure).toHaveBeenCalledWith('bar');

        indexRoutes.__ResetDependency__('Router');
        indexRoutes.__ResetDependency__('authRoutes');
    });
});
