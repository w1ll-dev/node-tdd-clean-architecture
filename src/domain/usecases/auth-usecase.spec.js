const { MissingParamError, InvalidParamError } = require('../../utils/errors/')

const AuthUseCase = require('./auth-usecase')

class LoadUserByEmailRepository {
  async load (email) {
    this.email = email
    return this.user
  }
}

class EncrypterHelperSpy {
  async compare (password, hashedPassword) {
    this.password = password
    this.hashedPassword = hashedPassword
  }
}

const makeSut = () => {
  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  loadUserByEmailRepository.user = { password: 'hashed_password' }
  const encrypterSpy = new EncrypterHelperSpy()
  const sut = new AuthUseCase(loadUserByEmailRepository, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepository,
    encrypterSpy
  }
}
describe('AuthUseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should throw if no loadUserByEmail is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })
  test('Should throw if loadUserByEmail has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepository.email).toBe('any_email@mail.com')
  })
  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call EncrypterHelper with correct values', async () => {
    const { sut, loadUserByEmailRepository, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepository.user.password)
  })
})
