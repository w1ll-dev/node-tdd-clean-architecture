const MissingParamError = require('../helpers/missing-param-error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      status: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError () {
    return {
      status: 500
    }
  }
}
