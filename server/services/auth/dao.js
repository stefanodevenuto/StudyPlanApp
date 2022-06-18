const AppDAO = require("../../db/AppDAO");

class AuthDAO extends AppDAO {
    async getUserByEmail(email) {
        const query = 'SELECT * FROM user WHERE email = ?';
        return await this.get(query, [email]);
    }

    async getUserByID(id) {
        const query = 'SELECT * FROM user WHERE id = ?';
        return await this.get(query, [id]);
    }
}

module.exports = AuthDAO;
