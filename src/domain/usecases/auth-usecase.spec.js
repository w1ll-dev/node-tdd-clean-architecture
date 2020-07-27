const { MissingParamError } = require('../../utils/errors/')

const makeSut = () => {
  class AuthUseCase {
    constructor (loadUserByEmailRepository) {
      this.loadUserByEmailRepository = loadUserByEmailRepository
    }

    async auth (email, password) {
      if (!email) {
        throw new MissingParamError('email')
      }
      if (!password) {
        throw new MissingParamError('password')
      }
      this.loadUserByEmailRepository.load(email)
    }
  }
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepository)
  return {
    sut,
    loadUserByEmailRepository
  }
}
describe('AuthUseCase', () => {
  test('Shoul throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Shoul throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Shoul call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepository.email).toBe('any_email@mail.com')
  })
})
