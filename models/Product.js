const db = require("../config/db");

class Product {
    static async getAll() {
        const [rows] = await db.execute(
            `SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.id DESC`
        );
        return rows;
    }

    static async create({ category_id, user_id, name, description, price, image }) {
        const [result] = await db.execute(
            "INSERT INTO products (category_id, user_id, name, description, price, image) VALUES (?, ?, ?, ?, ?, ?)",
            [category_id, user_id, name, description || null, price, image],
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?`,
            [id],
        );
        return rows[0];
    }

    static async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM products WHERE id = ?",
            [id],
        );
        return result.affectedRows;
    }

    static async update({ id, category_id, name, description, price, image }) {
        const [result] = await db.execute(
            "UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, image = ? WHERE id = ?",
            [category_id || null, name, description || null, price, image || null, id],
        );
        return result.affectedRows;
    }
}

module.exports = Product;
