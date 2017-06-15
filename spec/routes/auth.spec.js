const authRoutes = require('../../app/routes/auth/index');
const noop = () => {};

describe('routes/auth', () => {
    let routerSpy,
        passportSpy,
        result,
        logSpy;

    beforeEach(() => {
        const RouterSpy = jasmine.createSpy('Router');
        routerSpy = jasmine.createSpyObj('router', [
            'post',
        ]);

        RouterSpy.and.returnValue(routerSpy);

        passportSpy = jasmine.createSpyObj('passport', [
            'authenticate',
        ]);

        passportSpy.authenticate.and.returnValue(() => {})

        logSpy = jasmine.createSpy('log');

        authRoutes.__Rewire__('log', logSpy);
        authRoutes.__Rewire__('Router', RouterSpy);
        authRoutes.configure(RouterSpy, passportSpy);
    });

    afterEach(() => {
        authRoutes.__ResetDependency__('log');
        authRoutes.__ResetDependency__('Router');
    });

    it('registers a handler for /login', () => {
        expect(routerSpy.post).toHaveBeenCalledWith('/login', jasmine.any(Function));
    });

    it('registers handler for local login strategy', () => {
        authRoutes.handleLogin(passportSpy);
        expect(passportSpy.authenticate).toHaveBeenCalledWith('local-login', jasmine.any(Function));
    });

    it('logs an error when there is a server error during authentication', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        authRoutes.passportLogin(null, resSpy, noop, 'error', null, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'warn', 'error during authentication', 'error');
    });

    it('sends a 401 during an auth error (even a server one)', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        authRoutes.passportLogin(null, resSpy, noop, 'error', null, null);
        expect(resSpy.status).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({ authenticated: false });
    });

    it('logs an error when passport auth fails', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        const fakeReq = { params: { username: 'foo' }};
        authRoutes.passportLogin(fakeReq, resSpy, noop, null, null, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'info', 'Authentication failed for user foo');
    });

    it('sends a 401 when passport auth fails', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        const fakeReq = { params: { username: 'foo' }};
        authRoutes.passportLogin(fakeReq, resSpy, noop, null, null, null);
        expect(resSpy.status).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({ authenticated: false });
    });

    it('calls req.login if authentication was successful', () => {
        const resSpy = jasmine.createSpyObj('res', ['json']);
        const reqSpy = jasmine.createSpyObj('req', ['logIn']);
        authRoutes.passportLogin(reqSpy, resSpy, noop, null, { username: 'foo'}, null);
        expect(reqSpy.logIn).toHaveBeenCalledWith({username: 'foo'}, jasmine.any(Function));
    });

    it('calls next() with the error if an error happens calling req.logIn', () => {
        const nextSpy = jasmine.createSpy('next');
        authRoutes.loginSuccess(null, null, nextSpy, 'foo');
        expect(nextSpy).toHaveBeenCalledWith('foo');
    });

    it('logs a message if login succeeds', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        authRoutes.loginSuccess({username: 'foo'}, resSpy, noop, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'info', 'User foo authenticated');
    });

    it('sends a 200 when login succeeds', () => {
        const jsonSpy = jasmine.createSpy();
        const resSpy = jasmine.createSpyObj('res', ['status']);
        resSpy.status.and.returnValue({json: jsonSpy});
        authRoutes.loginSuccess({username: 'foo'}, resSpy, noop, null);
        expect(resSpy.status).toHaveBeenCalledWith(200);
        expect(jsonSpy).toHaveBeenCalledWith({authenticated: true});
    });
});
