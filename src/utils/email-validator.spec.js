const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => new EmailValidator()

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const email = 'valid_email@mail.com'
    const isEmailValid = sut.isValid(email)
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const email = 'valid_email@mail.com'
    const isEmailValid = sut.isValid(email)
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const email = 'any_email@mail.com'
    sut.isValid(email)
    expect(validator.email).toBe(email)
  })
})
