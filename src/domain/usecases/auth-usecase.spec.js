class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new Error()
    }
  }
}
describe('AuthUseCase', () => {
  test('Shoul throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
