const LoginRouter = require('../routers/login-router')
const MissingParamError = require('../helpers/missing-param-error')

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    // sut === system under test (component tested)
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    // sut === system under test
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    // sut === system under test
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.status).toBe(500)
  })

  test('Should return 500 if no httpRequest has no body', () => {
    // sut === system under test
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(500)
  })
})
