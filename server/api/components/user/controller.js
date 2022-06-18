const UserDao = require('./dao')
//const User = require("./user");
const { UserErrorFactory } = require('./error');
const { Authenticator } = require("../../../services/auth/authentication");

class UserController {
    constructor(authenticator) {
        this.authService = authenticator;
        this.dao = new UserDao();
    }

    // ################################ API

    async login(req, email, password) {
        const user = await this.dao.getUserByEmail(email);
        if (user === undefined)
            throw UserErrorFactory.newInvalidCredentials();

        let result = await Authenticator.verifyPassword(password, user.password, user.salt);
        if (!result)
            throw UserErrorFactory.newInvalidCredentials();

        await this.authService.login(req);
        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
    }

    async getAllUsers() {
        return await this.dao.getAllUsers();
    }
}

module.exports = UserController;