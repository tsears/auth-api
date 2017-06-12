import UserModel from '../../app/dataAccess/models/User';

describe('User model', () => {
    let User;

    beforeEach(() => {
        const mongooseMock = {
            Schema: function(schema) { return { schema, methods: {} }; },
            model: function(name, schema) { return { name, schema }; },
        }
        UserModel.__Rewire__('Mongoose', mongooseMock);
        User = UserModel();
    });

    afterEach(() => {
        User = null;
        UserModel.__ResetDependency__('Mongoose');
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
