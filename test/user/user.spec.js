const mockery = require('mockery');
const userModule = '../../app/user/user';

let User;

const mongooseMock = {
    Schema: function(schema) { return { schema, methods: {} }; },
    model: function(name, schema) { return { name, schema }; },
}

describe('User model', () => {
    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true,
        });

        mockery.registerAllowable(userModule);
        mockery.registerAllowable('bcrypt-nodejs');
        mockery.registerAllowable('crypto');
        mockery.registerMock('mongoose', mongooseMock);

        // eslint-disable-next-line global-require
        User = require(userModule);
    });

    afterEach(() => {
        User = null;
        mockery.disable();
        mockery.deregisterAll();
    });

    it('registers a method called generateHash', () => {
        expect(User.schema.methods.generateHash).not.toBeUndefined();
    })

    it('registers a method called validPassword', () => {
        expect(User.schema.methods.validPassword).not.toBeUndefined();
    });

    it('correctly reports a valid password', () => {
        const password = 'ooga booga';
        User.schema.password = password;
        const hashedPW = User.schema.methods.generateHash(password);
        const validPW = User.schema.methods.validPassword.bind({password: hashedPW}, password)();
        expect(validPW).toBe(true);
    });

    it('correctly reports an invalid password', () => {
        const password = 'ooga booga';
        User.schema.password = password;
        const hashedPW = User.schema.methods.generateHash(password);
        const validPW = User.schema.methods.validPassword.bind({password: hashedPW}, 'wrong password')();
        expect(validPW).toBe(false);
    });
});
