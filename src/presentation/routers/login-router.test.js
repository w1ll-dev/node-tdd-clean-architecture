class LoginRouter {
  route (httpRequest) {
    const { email } = httpRequest.body
    if (!email) {
      return {
        status: 400
      }
    }
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provider', () => {
    // sut === system under test
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
  })
})
