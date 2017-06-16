import Settings from '../app/settings'

describe('Settings', () => {
  it('extracts settings values from the environment', () => {
    const fakeEnv = {
      APP_PORT: 'a',
      MONGODB_IP: 'b',
      MONGODB_PORT: 'c',
      MONGODB_DATABASE: 'd',
      SESSION_SECRET: 'e',
      ADMIN_USER: 'f',
      ADMIN_PASS: 'g',
      APP_NAME: 'h',
    }

    const expectedSettings = {
      port: 'a',
      mongoIP: 'b',
      mongoPort: 'c',
      mongoDatabase: 'd',
      sessionSecret: 'e',
      adminUser: 'f',
      adminPass: 'g',
      appName: 'h',
    }

    const result = Settings(fakeEnv)
    expect(result).toEqual(expectedSettings)
  })
})
