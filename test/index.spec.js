const app = require('../app/index');
const noop = () => {};

describe('index.js', () => {
    describe('app.run()', () => {
        beforeEach(() => {
            spyOn(app, 'init');
            spyOn(app, 'configureServer');
            spyOn(app, 'configureRoutes');
            spyOn(app, 'configureDB');
            spyOn(app, 'startServer');

            app.run(noop, noop, noop, {}, {}, {}, {}, {}, {}, {});
        })

        it('calls app.init()', () => {
            expect(app.init).toHaveBeenCalled();
        });

        it('calls app.configureServer()', () => {
            expect(app.configureServer).toHaveBeenCalled();
        });

        it('calls app.configureRoutes()', () => {
            expect(app.configureRoutes).toHaveBeenCalled();
        });

        it('calls app.configureDB()', () => {
            expect(app.configureDB).toHaveBeenCalled();
        });

        it('calls app.startServer()', () => {
            expect(app.startServer).toHaveBeenCalled();
        });
    });

    describe('app.init()', () => {
        it('logs a message', () => {
            const logSpy = createSpy('log');
            const passportInitSpy = createSpyObj('passportInit', ['configure']);

            app.init(logSpy, noop, passportInitSpy, {}, {});

            expect(logSpy).toHaveBeenCalled();
        });

        it('calls adminInit with user, settings, and log', () => {
            const adminInitSpy = createSpy('adminInit');
            const passportInitSpy = createSpyObj('passportInit', ['configure']);
            const fakeSettings = {
                adminUser: 'foo',
                adminPass: 'bar',
            };

            const adminUserPass = {
                user: fakeSettings.adminUser,
                pass: fakeSettings.adminPass,
            }

            app.init(noop, adminInitSpy, passportInitSpy, fakeSettings, {}, 'User');
            expect(adminInitSpy).toHaveBeenCalledWith('User', adminUserPass, jasmine.any(Function));
        });

        it('calls passportInit with passport and user', () => {
            const passportInitSpy = createSpyObj('passportInit', ['configure']);

            app.init(noop, noop, passportInitSpy, {}, {}, {});

            expect(passportInitSpy.configure).toHaveBeenCalled();
        });
    });

    describe('app.configureServer()', () => {
        let restifySpy,
            sessionsSpy,
            fakeSettings,
            useCalls,
            server;

        beforeEach(() => {
            restifySpy = createSpyObj('restify', [
                'createServer',
                'queryParser',
                'bodyParser',
            ]);


            const serverSpy = createSpyObj('server', ['use']);
            restifySpy.createServer.andReturn(serverSpy);
            restifySpy.queryParser.andReturn('queryParser');
            restifySpy.bodyParser.andReturn('bodyParser');

            const flashSpy = createSpy('flash');
            flashSpy.andReturn('flash');

            sessionsSpy = createSpy('sessions');
            sessionsSpy.andReturn('sessions');

            const passportSpy = createSpyObj('passport', [
                'initialize',
                'session',
            ]);
            passportSpy.initialize.andReturn('passport-initialize');
            passportSpy.session.andReturn('passport-session');

            fakeSettings = {
                appName: 'foo',
                sessionSecret: 'bar',
            }

            server = app.configureServer(restifySpy, sessionsSpy, fakeSettings, flashSpy, passportSpy);
        });

        it('creates the restify server', () => {
            expect(restifySpy.createServer).toHaveBeenCalledWith({ name: fakeSettings.appName });
        });

        it('registers queryparser middleware', () => {
            expect(server.use.argsForCall[0][0]).toBe('queryParser');
        });

        it('registers the bodyParser middleware', () => {
            expect(server.use.argsForCall[1][0]).toBe('bodyParser');
        });

        it('registers the flash middleware', () => {
            expect(server.use.argsForCall[2][0]).toBe('flash');
        });

        it('registers sessions middleware', () => {
            expect(server.use.argsForCall[3][0]).toBe('sessions');
            expect(sessionsSpy).toHaveBeenCalledWith({
                cookieName: 'session',
                secret: fakeSettings.sessionSecret,
                duration: 90 * 24 * 60 * 60 * 1000,
            });
        });

        it('registers passport middleware', () => {
            expect(server.use.argsForCall[4][0]).toBe('passport-initialize');
        });

        it('registers passport session middleware', () => {
            expect(server.use.argsForCall[5][0]).toBe('passport-session');
        });
    });

    describe('app.configureRoutes()', () => {
        let routerSpy;

        beforeEach(() => {
            const RouterSpy = createSpy('Router');
            routerSpy = createSpyObj('router', [
                'add',
                'applyRoutes',
            ])

            RouterSpy.andReturn(routerSpy);

            const routesSpy = createSpy('routes');
            routesSpy.andReturn('foo');

            app.configureRoutes(RouterSpy, routesSpy, 'server', 'passport', 'log');
        });

        it('adds base routes', () => {
            expect(routerSpy.add).toHaveBeenCalledWith('/', 'foo');
        });

        it('applies the routes', () => {
            expect(routerSpy.applyRoutes).toHaveBeenCalledWith('server', '/');
        })
    });

    describe('app.configureDB', () => {
        let mongooseSpy,
            logSpy;

        beforeEach(() => {
            const fakeSettings = {
                mongoIP: 'a.b.c.d',
                mongoPort: 123,
                mongoDatabase: 'foo',
            };

            const promise = 'promise';

            mongooseSpy = createSpyObj('mongoose', [
                'connect',
            ]);

            logSpy = createSpy('log');

            app.configureDB(mongooseSpy, fakeSettings, promise, logSpy);
        });

        it('calls connect with the correct url', () => {
            expect(mongooseSpy.connect).toHaveBeenCalledWith('mongodb://a.b.c.d:123/foo');
        });

        it('configures mongoose to use es6 promises', () => {
            expect(mongooseSpy.Promise).toBe('promise');
        })

        it('logs status', () => {
            expect(logSpy).toHaveBeenCalledWith('db', 'info', 'Connected to db @ mongodb://a.b.c.d:123/foo');
        });
    });

    describe('app.startServer()', () => {
        let serverSpy,
            logSpy;

        beforeEach(() => {
            serverSpy = createSpyObj('server', [
                'listen',
            ]);

            const fakeSettings = { port: 123 };

            app.startServer(serverSpy, fakeSettings, noop);
        });

        it('calls server.listen with correct port', () => {
            expect(serverSpy.listen).toHaveBeenCalledWith(123, jasmine.any(Function))
        })
    });
});
