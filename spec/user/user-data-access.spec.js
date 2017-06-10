const userDataAccess = require('../../app/dataAccess/user');

describe('dataAccess/user', () => {
    let UserSpy,
        user;

    beforeEach(() => {
        UserSpy = createSpyObj('User', ['findById', 'findOne'])
        UserSpy.findById.andReturn( { exec: () => {} });
        UserSpy.findOne.andReturn( { exec: () => {} });
        user = userDataAccess(UserSpy);
    });

    afterEach(() => {
        UserSpy = null;
        user = null;
    })

    it('findUserById queries for user by id', () => {
        user.findById('123');
        expect(UserSpy.findById).toHaveBeenCalledWith('123');
    });

    it('findUserByName queries for user by username', () => {
        user.findByName('foo');
        expect(UserSpy.findOne).toHaveBeenCalledWith({ username: 'foo'});
    })

    it('create creates a new user', () => {
        UserSpy = createSpy().andReturn({
            generateHash: (p) => p,
            save: () => { return { exec: () => { return this; } } },
        });

        user = userDataAccess(UserSpy);

        user.create('foo', 'bar');
        expect(UserSpy).toHaveBeenCalled();

    });
});
