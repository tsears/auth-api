const userDataAccess = require('../../app/dataAccess/user');

describe('dataAccess/user', () => {
    let UserSpy,
        generateHashSpy,
        saveSpy;

    beforeEach(() => {
        const fakeExec = { exec: () => {}};
        UserSpy = jasmine.createSpy();
        UserSpy.findById = jasmine.createSpy().and.returnValue(fakeExec);
        UserSpy.findOne = jasmine.createSpy().and.returnValue(fakeExec);
        saveSpy = jasmine.createSpy().and.returnValue(fakeExec);

        generateHashSpy = jasmine.createSpy();
        UserSpy.and.returnValue({
            generateHash: generateHashSpy,
            save: saveSpy,
        });

        userDataAccess.__Rewire__('UserModel', UserSpy);
    });

    afterEach(() => {
        UserSpy = null;
        userDataAccess.__ResetDependency__('UserModel');
    })

    it('findById queries for user by id', () => {
        userDataAccess.findById('123');
        expect(UserSpy.findById).toHaveBeenCalledWith('123');
    });

    it('findByName queries for user by username', () => {
        userDataAccess.findByName('foo');
        expect(UserSpy.findOne).toHaveBeenCalledWith({ username: 'foo'});
    })

    it('create creates a new user', () => {
        userDataAccess.create('foo', 'bar');
        expect(UserSpy).toHaveBeenCalled();
        expect(generateHashSpy).toHaveBeenCalledWith('bar');
        expect(saveSpy).toHaveBeenCalled();
    });
});
