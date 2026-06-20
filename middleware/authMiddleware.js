const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
    try {
        const userId = req.headers["user_id"];

        if (!userId) {
            return res.status(401).json({
                message: "User ID tidak ditemukan. Silakan login ulang.",
            });
        }

        const [rows] = await db.execute(
            "SELECT id, username, role, status FROM users WHERE id = ?",
            [userId],
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "User tidak valid.",
            });
        }

        // simpan user ke request
        req.user = rows[0];

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error saat autentikasi.",
        });
    }
};

module.exports = authMiddleware;
