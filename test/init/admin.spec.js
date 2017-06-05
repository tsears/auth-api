const adminInit = require('../../app/init/admin');
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

describe('admin init', () => {
    it('does a thing', () => {
        let findByNameArgs,
            createArgs;

        const fake = (...args) => {
            return fakePromise(args);
        }

        const logSpy = createSpy('log');

        const findByNameFake = fake;
        const createFake = fake;

        UserSpy = createSpyObj('User', ['findByName', 'create']);
        UserSpy.findByName.andCallFake(findByNameFake);
        UserSpy.create.andCallFake(createFake);

        const options = {
            user: 'foo',
            pass: 'bar',
        };

        adminInit(UserSpy, options, logSpy);

        expect(UserSpy.findByName).toHaveBeenCalledWith('foo');
        expect(UserSpy.create).toHaveBeenCalledWith('foo', 'bar');
        expect(logSpy).toHaveBeenCalledWith(
            'init',
            'error',
            'Error creating admin account',
            jasmine.any(Object)
        );

        expect(logSpy).toHaveBeenCalledWith(
            'init',
            'error',
            'Error querying for admin',
            { message: 'foo' }
        );

        expect(logSpy).toHaveBeenCalledWith(
            'init',
            'info',
            'Created admin user: foo'
        );
    });
});
