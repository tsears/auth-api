const authRoutes = require('../../app/routes/auth/index');
const noop = () => {};

describe('routes/auth', () => {
    let routerSpy,
        passportSpy,
        result,
        logSpy;

    beforeEach(() => {
        const RouterSpy = createSpy('Router');
        routerSpy = createSpyObj('router', [
            'post',
        ]);

        RouterSpy.andReturn(routerSpy);

        passportSpy = createSpyObj('passport', [
            'authenticate',
        ]);

        passportSpy.authenticate.andReturn(() => {})

        logSpy = createSpy('log');

        authRoutes.configure(RouterSpy, passportSpy, logSpy);
    });

    it('registers a handler for /login', () => {
        expect(routerSpy.post).toHaveBeenCalledWith('/login', jasmine.any(Function));
    });

    it('registers handler for local login strategy', () => {
        authRoutes.handleLogin(passportSpy);
        expect(passportSpy.authenticate).toHaveBeenCalledWith('local-login', jasmine.any(Function));
    });

    it('logs an error when there is a server error during authentication', () => {
        const resSpy = createSpyObj('res', ['json']);
        authRoutes.passportLogin(null, resSpy, noop, logSpy, 'error', null, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'warn', 'error during authentication', 'error');
    });

    it('sends a 401 during an auth error (even a server one)', () => {
        const resSpy = createSpyObj('res', ['json']);
        authRoutes.passportLogin(null, resSpy, noop, logSpy, 'error', null, null);
        expect(resSpy.json).toHaveBeenCalledWith(401, { authenticated: false });
    });

    it('logs an error when passport auth fails', () => {
        const resSpy = createSpyObj('res', ['json']);
        const fakeReq = { params: { username: 'foo' }};
        authRoutes.passportLogin(fakeReq, resSpy, noop, logSpy, null, null, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'info', 'Authentication failed for user foo');
    });

    it('sends a 401 when passport auth fails', () => {
        const resSpy = createSpyObj('res', ['json']);
        const fakeReq = { params: { username: 'foo' }};
        authRoutes.passportLogin(fakeReq, resSpy, noop, logSpy, null, null, null);
        expect(resSpy.json).toHaveBeenCalledWith(401, { authenticated: false });
    });

    it('calls req.login if authentication was successful', () => {
        const resSpy = createSpyObj('res', ['json']);
        const reqSpy = createSpyObj('req', ['logIn']);
        authRoutes.passportLogin(reqSpy, resSpy, noop, logSpy, null, { username: 'foo'}, null);
        expect(reqSpy.logIn).toHaveBeenCalledWith({username: 'foo'}, jasmine.any(Function));
    });

    it('calls next() with the error if an error happens calling req.logIn', () => {
        const nextSpy = createSpy('next');
        authRoutes.loginSuccess(null, null, null, nextSpy, 'foo');
        expect(nextSpy).toHaveBeenCalledWith('foo');
    });

    it('logs a message if login succeeds', () => {
        const resSpy = createSpyObj('res', ['json']);
        authRoutes.loginSuccess({username: 'foo'}, resSpy, logSpy, noop, null);
        expect(logSpy).toHaveBeenCalledWith('auth', 'info', 'User foo authenticated');
    });

    it('sends a 200 when login succeeds', () => {
        const resSpy = createSpyObj('res', ['json']);
        authRoutes.loginSuccess({username: 'foo'}, resSpy, logSpy, noop, null);
        expect(resSpy.json).toHaveBeenCalledWith(200, {authenticated: true});
    });
});
