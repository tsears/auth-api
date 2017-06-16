import Admin from '../../app/init/admin'
import MockUser from '../support/MockUser'

describe('admin init', () => {
  const MockLog = jasmine.createSpy('Log')

  beforeEach(() => {
    Admin.__Rewire__('User', MockUser)
    Admin.__Rewire__('log', MockLog)
  })

  afterEach(() => {
    Admin.__ResetDependency__('User')
    Admin.__ResetDependency__('Log')
  })

  it('Initializes', () => {
    const options = {
      user: 'foo',
      pass: 'bar',
    }

    spyOn(MockUser, 'findByName').and.callThrough()
    spyOn(MockUser, 'create').and.callThrough()

    Admin(options)

    expect(MockUser.findByName).toHaveBeenCalledWith('foo')
    expect(MockUser.create).toHaveBeenCalledWith('foo', 'bar')
    expect(MockLog).toHaveBeenCalledWith(
            'init',
            'error',
            'Error creating admin account',
            jasmine.any(Object)
        )

    expect(MockLog).toHaveBeenCalledWith(
            'init',
            'error',
            'Error querying for admin',
            { message: 'Fake Error' }
        )

    expect(MockLog).toHaveBeenCalledWith(
            'init',
            'info',
            'Created admin user: foo'
        )
  })
})
