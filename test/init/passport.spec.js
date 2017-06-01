const mockery = require('mockery');
const passportInitModule = '../../app/init/passport';

const LocalStrategyMock = (config, handler) => {
    Strategy = {
        config,
        handler,
    };
}

const UserFake = {
    findOne: (config) => { return { exec: () => { return { then: () => {} }; } }; },
}

mockery.registerAllowable(passportInitModule);
mockery.enable();
mockery.registerMock('passport-local', LocalStrategyMock);
const passportInit = require(passportInitModule);

describe('Passport init', () => {
    const passport = createSpyObj('passport', [
        'serializeUser',
        'deserializeUser',
        'use',
    ]);

    it('registers a serialze user callback', () => {
        passportInit(passport, UserFake);
        expect(passport.serializeUser).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('registers a deserialize user callback', () => {
        passportInit(passport, UserFake);
        expect(passport.deserializeUser).toHaveBeenCalledWith(jasmine.any(Function));
    })

    it('registers local login middleware', () => {
        passportInit(passport, UserFake);
        expect(passport.use).toHaveBeenCalledWith(
            'local-login',
            jasmine.any(Object)
        );
    });

    it('configures the correct username and passport fields', () => {
        passportInit(passport, UserFake);
        expect(passport.use.calls[3].args[1]._usernameField).toBe('username');
        expect(passport.use.calls[3].args[1]._passwordField).toBe('password');
    });
});

mockery.disable();
