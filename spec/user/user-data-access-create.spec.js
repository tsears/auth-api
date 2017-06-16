import userDataAccess from '../../app/dataAccess/user'

describe('dataAccess/user save', () => {
  let UserSpy
  let generateHashSpy
  let saveSpy

  beforeAll(() => {
    UserSpy = jasmine.createSpy()
    saveSpy = jasmine.createSpy()
    generateHashSpy = jasmine.createSpy()

    UserSpy.and.returnValue({
      generateHash: generateHashSpy,
      save: saveSpy,
    })

    userDataAccess.__Rewire__('UserModel', UserSpy)
  })

  afterAll(() => {
    userDataAccess.__ResetDependency__('UserModel')
  })

  it('creates a new user', () => {
    userDataAccess.create('foo', 'bar')
    expect(UserSpy).toHaveBeenCalled()
    expect(generateHashSpy).toHaveBeenCalledWith('bar')
    expect(saveSpy).toHaveBeenCalled()
  })
})
