const mockery = require('mockery');
const userModule = '../../app/user/user';

const mongooseMock = {
    Schema: (schema) => { return { schema, methods: null }; },
    model: (name, schema) => { return { name, schema }; },
}

mockery.registerAllowable(userModule);
mockery.enable();
mockery.registerMock('mongoose', mongooseMock);
const User = require(userModule);

describe('User model', () => {
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

mockery.disable();
