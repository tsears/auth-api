import userDataAccess from '../../app/dataAccess/user'

describe('dataAccess/user queries', () => {
  let UserSpy
  let findByIdSpy
  let findOneSpy

  beforeAll(() => {
    const fakeExec = { exec: () => {} }
    UserSpy = jasmine.createSpy()
    findByIdSpy = jasmine.createSpy().and.returnValue(fakeExec)
    findOneSpy = jasmine.createSpy().and.returnValue(fakeExec)

    UserSpy.and.returnValue({
      findById: findByIdSpy,
      findOne: findOneSpy,
    })

    userDataAccess.__Rewire__('UserModel', UserSpy)
  })

  afterAll(() => {
    userDataAccess.__ResetDependency__('UserModel')
  })

  it('findById queries for user by id', () => {
    userDataAccess.findById('123')
    expect(findByIdSpy).toHaveBeenCalledWith('123')
  })

  it('findByName queries for user by username', () => {
    userDataAccess.findByName('foo')
    expect(findOneSpy).toHaveBeenCalledWith({ username: 'foo' })
  })
})
