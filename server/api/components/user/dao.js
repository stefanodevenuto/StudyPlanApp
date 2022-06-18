const AppDAO = require("../../../db/AppDAO");

class UserDAO extends AppDAO {
    async getAllUsers() {
        const query = 'SELECT * FROM user';
        return await this.all(query);
    }

    async getUserByEmail(email) {
        const query = 'SELECT * FROM user WHERE email = ?';
        return await this.get(query, [email]);
    }
}

module.exports = UserDAO;
