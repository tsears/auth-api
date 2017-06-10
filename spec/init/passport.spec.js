const mockery = require('mockery');
const passportInitModule = '../../app/init/passport';
let passportInit;

function LocalStrategyMock(config, handler) {
    this.config = config;
    this.handler = handler;
}

const fakePromise = (arg) => {
    // fake a promise chain without the async baggage...
    return {
        then: function(fn) {
            fn(null, arg);

            return {
                catch: (fn) => { fn({message: 'foo'}) },
            }
        },

    }
}

const UserDataAccessMock =  {
    findById: fakePromise,
    findByName: fakePromise,
}

const UserFake = {
    findOne: () => {},
}

describe('Passport init', () => {

    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true,
        });
        mockery.registerAllowable(passportInitModule);
        mockery.registerMock('passport-local', LocalStrategyMock);

        // eslint-disable-next-line global-require
        passportInit = require(passportInitModule);
    });

    afterEach(() => {
        mockery.disable();
        mockery.deregisterAll();
        passportInit = null;
    })

    const passport = createSpyObj('passport', [
        'serializeUser',
        'deserializeUser',
        'use',
    ]);

    describe('configure', () => {
        it('registers a serialze user callback', () => {
            passportInit.configure(passport, UserDataAccessMock, LocalStrategyMock);
            expect(passport.serializeUser).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('registers a deserialize user callback', () => {
            passportInit.configure(passport, UserDataAccessMock, LocalStrategyMock);
            expect(passport.deserializeUser).toHaveBeenCalledWith(jasmine.any(Function));
        })

        it('registers local login middleware', () => {
            passportInit.configure(passport, UserDataAccessMock, LocalStrategyMock);
            expect(passport.use).toHaveBeenCalledWith(
                'local-login',
                jasmine.any(Object)
            );
        });

        it('configures the correct username and passport fields', () => {
            const strategy = passportInit.configure(passport, UserDataAccessMock, LocalStrategyMock);
            expect(strategy.config.usernameField).toBe('username');
            expect(strategy.config.passwordField).toBe('password');
        });
    });

    describe('_serialzeUser', () => {
        it('calls the done argument with the user id', () => {
            fakeUser = {  _id: 12345 };
            doneSpy = createSpy('done');

            passportInit._serializeUser(fakeUser, doneSpy);
            expect(doneSpy).toHaveBeenCalledWith(null, 12345);
        });
    });

    describe('_userFound', () => {
        it('calls the done argument with an error and a user', () => {
            doneSpy = createSpy('done');
            passportInit._userFound(doneSpy, 'error', 'user');
            expect(doneSpy).toHaveBeenCalledWith('error', 'user');
        });
    });

    describe('_deserializeUser', () => {
        it('calls userFound', () => {
            // the userDataAccess.findUserById fake will also cause the error
            // handler to be called....
            const oldError = console.error;
            console.error = createSpy();
            const userFoundSpy = createSpy('userFound');

            passportInit._deserializeUser(UserDataAccessMock, userFoundSpy, 123, 'done');

            expect(userFoundSpy).toHaveBeenCalledWith('done', null, 123);
            expect(console.error).toHaveBeenCalledWith('error', 'foo');

            console.error = oldError;
        });
    });

    describe('_authenticate', () => {
        it('flashes failure if user is not found', () => {
            const dummy = (...args) => { return args; };
            const req = { flash: dummy };

            result = passportInit._authenticate(req, 'foo', 'bar', dummy, null);

            expect(result).toEqual([null, false, [ 'loginMessage', 'Login Failed.']]);
        });

        it('flashes failure on incorrect password', () => {
            const userSpy = createSpyObj('user', ['validPassword']);
            userSpy.validPassword.andReturn(false);
            const dummy = (...args) => { return args; };
            const req = { flash: dummy };

            result = passportInit._authenticate(req, 'foo', 'bar', dummy, userSpy);

            expect(result).toEqual([null, false, [ 'loginMessage', 'Login Failed.']]);
        });

        it('calls done with the user', () => {
            const userSpy = createSpyObj('user', ['validPassword']);
            userSpy.validPassword.andReturn(true);
            const dummy = (...args) => { return args; };

            result = passportInit._authenticate(null, 'foo', 'bar', dummy, userSpy);

            expect(result).toEqual([ null, userSpy ]);
        });
    });

    describe('_localStrategy', () => {
        it('calls authenticate and the error handler', () => {
            // fake promise allows for both happen simultaneously
            const reqSpy = createSpyObj('req', ['flash']);
            const doneSpy = createSpy('done');
            passportInit._localStrategy(UserDataAccessMock)(reqSpy, 'foo', 'bar', doneSpy)
            expect(doneSpy).toHaveBeenCalledWith(null, false, undefined);
            expect(doneSpy).toHaveBeenCalledWith( { message: 'foo' });
        });
    });
});
