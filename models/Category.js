const db = require("../config/db");

class Category {
    static async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM categories ORDER BY id DESC",
        );
        return rows;
    }

    static async create({ name, user_id }) {
        const [result] = await db.execute(
            "INSERT INTO categories (name, user_id) VALUES (?, ?)",
            [name, user_id],
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ?",
            [id],
        );

        return rows[0];
    }

    static async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM categories WHERE id = ?",
            [id],
        );
        return result.affectedRows;
    }

    static async update({ id, name }) {
        const [result] = await db.execute(
            "UPDATE categories SET name = ? WHERE id = ?",
            [name, id],
        );
        return result.affectedRows;
    }
}

module.exports = Category;
