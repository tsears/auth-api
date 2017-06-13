import app from '../app';
const noop = () => {};

describe('index.js', () => {
    let logSpy,
        adminInitSpy,
        settingsSpy,
        passportInitSpy,
        expressSpy,
        expressRouterSpy,
        expressUseSpy,
        expressListenSpy,
        bodyParserSpy,
        flashSpy,
        sessionSpy,
        passportInitializeSpy,
        passportSessionSpy,
        passportSpy,
        routerSpy,
        routerUseSpy,
        routesSpy,
        mongooseSpy;

    beforeAll(() => { // eslint-disable-line max-statements
        logSpy = jasmine.createSpy();
        adminInitSpy = jasmine.createSpy();
        passportInitSpy = jasmine.createSpyObj('passportInit', ['configure']);
        bodyParserSpy = jasmine.createSpy().and.returnValue('bodyParser object');
        flashSpy = jasmine.createSpy().and.returnValue('flash object');
        routerUseSpy = jasmine.createSpy();
        expressUseSpy = jasmine.createSpy();
        expressListenSpy = jasmine.createSpy();
        expressRouterSpy = jasmine.createSpy().and.returnValue({
            use: routerUseSpy,
        });
        expressSpy = jasmine.createSpy().and.returnValue({
            use: expressUseSpy,
            listen: expressListenSpy,
        });
        expressSpy.Router = expressRouterSpy;
        routesSpy = jasmine.createSpy().and.returnValue('routes object');
        sessionSpy = jasmine.createSpy().and.returnValue('session object');
        passportInitializeSpy = jasmine.createSpy();
        passportSessionSpy = jasmine.createSpy();
        passportSpy = jasmine.createSpy();
        mongooseSpy = jasmine.createSpyObj('mongoose', ['connect']);

        passportSpy.initialize = passportInitializeSpy.and.returnValue('passport init object');
        passportSpy.session = passportSessionSpy.and.returnValue('passport session object');

        const fakeSettings = {
            adminUser: 'foo',
            adminPass: 'bar',
            sessionSecret: 'baz',
            mongoIP: 'qux',
            mongoPort: 'quxx',
            mongoDatabase: 'apple',
            port: 123,
        };

        settingsSpy = jasmine.createSpy().and.returnValue(fakeSettings);

        app.__Rewire__('log', logSpy);
        app.__Rewire__('adminInit', adminInitSpy);
        app.__Rewire__('Settings', settingsSpy);
        app.__Rewire__('passportInit', passportInitSpy);
        app.__Rewire__('passport', passportSpy);
        app.__Rewire__('bodyParser', bodyParserSpy);
        app.__Rewire__('flash', flashSpy);
        app.__Rewire__('express', expressSpy);
        app.__Rewire__('session', sessionSpy);
        app.__Rewire__('routes', routesSpy);
        app.__Rewire__('mongoose', mongooseSpy);
        app();
    });

    afterAll(() => {
        app.__ResetDependency__('log');
        app.__ResetDependency__('adminInit');
        app.__ResetDependency__('Settings');
        app.__ResetDependency__('passportInit');
        app.__ResetDependency__('passport');
        app.__ResetDependency__('bodyParser');
        app.__ResetDependency__('flash');
        app.__ResetDependency__('express');
        app.__ResetDependency__('session');
        app.__ResetDependency__('routes');
        app.__ResetDependency__('mongoose');
    });

    it('Initializes Settings', () => {
        expect(settingsSpy).toHaveBeenCalledWith(jasmine.anything());
    });

    it('initializes logging', () => {
        expect(logSpy).toHaveBeenCalledWith('log', 'info', 'initialized logging');
    })

    it('calls adminInit with user, settings, and log', () => {
        expect(adminInitSpy).toHaveBeenCalledWith({
            user: 'foo',
            pass: 'bar',
        });
    });

    it('calls passportInit with passport', () => {
        expect(passportInitSpy.configure).toHaveBeenCalledWith(passportSpy);
    });

    it('creates the express server', () => {
        expect(expressSpy).toHaveBeenCalled();
    });

    it('registers the bodyParser middleware', () => {
        expect(bodyParserSpy).toHaveBeenCalled();
        expect(expressUseSpy).toHaveBeenCalledWith('bodyParser object');
    });

    it('registers the flash middleware', () => {
        expect(flashSpy).toHaveBeenCalled();
        expect(expressUseSpy).toHaveBeenCalledWith('flash object');
    });

    it('registers sessions middleware', () => {
        expect(expressUseSpy).toHaveBeenCalledWith('session object');
        expect(sessionSpy).toHaveBeenCalledWith({
            cookieName: 'session',
            secret: 'baz',
            duration: 90 * 24 * 60 * 60 * 1000,
        });
    });

    it('registers passport middleware', () => {
        expect(expressUseSpy).toHaveBeenCalledWith('passport init object');
        expect(passportInitializeSpy).toHaveBeenCalled();
    });

    it('registers passport session middleware', () => {
        expect(expressUseSpy).toHaveBeenCalledWith('passport session object');
        expect(passportSessionSpy).toHaveBeenCalled();
    });

    it('logs route initialization', () => {
        expect(logSpy).toHaveBeenCalledWith('routes', 'info', 'initializing routes');
    });

    it('adds base routes', () => {
        expect(routerUseSpy).toHaveBeenCalledWith('routes object');
    });

    it('applies the routes', () => {
        expect(expressUseSpy).toHaveBeenCalledWith('/', jasmine.any(Object));
    });

    it('tells mongoose to use es6 promises', () => {
        expect(mongooseSpy.Promise).toEqual(global.Promise);
    });

    it('calls connect with the correct url', () => {
        expect(mongooseSpy.connect).toHaveBeenCalledWith('mongodb://qux:quxx/apple');
    });

    it('logs mongo connection status', () => {
        expect(logSpy).toHaveBeenCalledWith('db', 'info', 'Connected to db @ mongodb://qux:quxx/apple');
    });

    it('calls server.listen with correct port', () => {
        expect(expressListenSpy).toHaveBeenCalledWith(123, jasmine.any(Function))
    });
});
