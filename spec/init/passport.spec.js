import MockUser from '../support/MockUser'
import passportInit from '../../app/init/passport'

describe('Passport init', () => {
  beforeEach(() => {
    function LocalStrategyMock (config, handler) {
      this.config = config
      this.handler = handler
    }

    passportInit.__Rewire__('UserAccess', MockUser)
    passportInit.__Rewire__('LocalStrategy', LocalStrategyMock)
  })

  afterEach(() => {
    passportInit.__ResetDependency__('Strategy')
    passportInit.__ResetDependency__('UserAccess')
  })

  const passport = jasmine.createSpyObj('passport', [
    'serializeUser',
    'deserializeUser',
    'use',
  ])

  describe('configure', () => {
    it('registers a serialze user callback', () => {
      passportInit.configure(passport)
      expect(passport.serializeUser).toHaveBeenCalledWith(jasmine.any(Function))
    })

    it('registers a deserialize user callback', () => {
      passportInit.configure(passport)
      expect(passport.deserializeUser).toHaveBeenCalledWith(jasmine.any(Function))
    })

    it('registers local login middleware', () => {
      passportInit.configure(passport)
      expect(passport.use).toHaveBeenCalledWith(
                'local-login',
                jasmine.any(Object)
            )
    })

    it('configures the correct username and passport fields', () => {
      const strategy = passportInit.configure(passport)
      expect(strategy.config.usernameField).toBe('username')
      expect(strategy.config.passwordField).toBe('password')
    })
  })

  describe('_serialzeUser', () => {
    it('calls the done argument with the user id', () => {
      const fakeUser = { _id: 12345 }
      const doneSpy = jasmine.createSpy('done')

      passportInit._serializeUser(fakeUser, doneSpy)
      expect(doneSpy).toHaveBeenCalledWith(null, 12345)
    })
  })

  describe('_userFound', () => {
    it('calls the done argument with an error and a user', () => {
      const doneSpy = jasmine.createSpy('done')
      passportInit._userFound(doneSpy, 'error', 'user')
      expect(doneSpy).toHaveBeenCalledWith('error', 'user')
    })
  })

  describe('_deserializeUser', () => {
    it('calls userFound', () => {
            // the userDataAccess.findUserById fake will also cause the error
            // handler to be called....
      const oldError = console.error
      console.error = jasmine.createSpy()
      const userFoundSpy = jasmine.createSpy('userFound')

      passportInit._deserializeUser(userFoundSpy, 123, 'done')

      expect(userFoundSpy).toHaveBeenCalledWith('done', null, [123])
      expect(console.error).toHaveBeenCalledWith('error', 'Fake Error')

      console.error = oldError
    })
  })

  describe('_authenticate', () => {
    it('flashes failure if user is not found', () => {
      const dummy = (...args) => { return args }
      const req = { flash: dummy }

      const result = passportInit._authenticate(req, 'foo', 'bar', dummy, null)

      expect(result).toEqual([null, false, [ 'loginMessage', 'Login Failed.' ]])
    })

    it('flashes failure on incorrect password', () => {
      const userSpy = jasmine.createSpyObj('user', ['validPassword'])
      userSpy.validPassword.and.returnValue(false)
      const dummy = (...args) => { return args }
      const req = { flash: dummy }

      const result = passportInit._authenticate(req, 'foo', 'bar', dummy, userSpy)

      expect(result).toEqual([null, false, [ 'loginMessage', 'Login Failed.' ]])
    })

    it('calls done with the user', () => {
      const userSpy = jasmine.createSpyObj('user', ['validPassword'])
      userSpy.validPassword.and.returnValue(true)
      const dummy = (...args) => { return args }

      const result = passportInit._authenticate(null, 'foo', 'bar', dummy, userSpy)

      expect(result).toEqual([ null, userSpy ])
    })
  })

  describe('_localStrategy', () => {
    it('calls authenticate and the error handler', () => {
            // fake promise allows for both happen simultaneously
      const reqSpy = jasmine.createSpyObj('req', ['flash'])
      const doneSpy = jasmine.createSpy('done')
      passportInit._localStrategy()(reqSpy, 'foo', 'bar', doneSpy)
      expect(doneSpy).toHaveBeenCalledWith(null, false, undefined)
      expect(doneSpy).toHaveBeenCalledWith({ message: 'Fake Error' })
    })
  })
})
