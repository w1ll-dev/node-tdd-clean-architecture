const { MissingParamError, InvalidParamError } = require('../../utils/errors/')

const AuthUseCase = require('./auth-usecase')

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepository = new LoadUserByEmailRepository()
  loadUserByEmailRepository.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepository
}
const makeEncrypterHelperSpy = () => {
  class EncrypterHelperSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterHelperSpy = new EncrypterHelperSpy()
  encrypterHelperSpy.isValid = true
  return encrypterHelperSpy
}
const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase(
    loadUserByEmailRepository,
    encrypterHelperSpy,
    tokenGeneratorSpy
  )

  return {
    sut,
    loadUserByEmailRepository,
    encrypterHelperSpy,
    tokenGeneratorSpy
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
    const { sut, encrypterHelperSpy } = makeSut()
    encrypterHelperSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call EncrypterHelper with correct values', async () => {
    const { sut, loadUserByEmailRepository, encrypterHelperSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterHelperSpy.password).toBe('any_password')
    expect(encrypterHelperSpy.hashedPassword).toBe(loadUserByEmailRepository.user.password)
  })
  test('Should call tokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepository, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepository.user.id)
  })
})
