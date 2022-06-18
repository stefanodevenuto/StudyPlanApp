const INVALID_CREDENTIALS = "Invalid credentials";

class UserErrorFactory extends Error {
  static newInvalidCredentials() {
    let error = new Error();
    error.customMessage = INVALID_CREDENTIALS;
    error.customCode = 401;

    return error;
  }
}

module.exports = { UserErrorFactory }