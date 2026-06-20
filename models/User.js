const db = require("../config/db");

class User {
    static async getAll() {
        const [rows] = await db.execute(
            "SELECT id, username, email, role, status FROM users ORDER BY id DESC"
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            "SELECT id, username, email, role, status FROM users WHERE id = ?",
            [id]
        );
        return rows[0];
    }

    static async create({ username, password, email, role, status = "active" }) {
        const [result] = await db.execute(
            "INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, ?, ?)",
            [username, password, email, role, status],
        );
        return result.insertId;
    }

    static async update({ id, username, password, email, role, status }) {
        if (password) {
            const [result] = await db.execute(
                "UPDATE users SET username = ?, password = ?, email = ?, role = ?, status = ? WHERE id = ?",
                [username, password, email, role, status, id]
            );
            return result.affectedRows;
        } else {
            const [result] = await db.execute(
                "UPDATE users SET username = ?, email = ?, role = ?, status = ? WHERE id = ?",
                [username, email, role, status, id]
            );
            return result.affectedRows;
        }
    }

    static async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }

    static async findByUsername(username) {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username],
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        return rows[0];
    }
}

module.exports = User;

