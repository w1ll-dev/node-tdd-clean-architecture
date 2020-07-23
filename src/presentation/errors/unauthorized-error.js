module.exports = class UnalthorizedError extends Error {
  constructor (paramName) {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
