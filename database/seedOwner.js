require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

async function seedOwner() {
    try {
        const username = "owner";
        const password = "owner";
        const email = "owner@example.com";
        const role = "owner";

        const [rows] = await db.query("SELECT id FROM users WHERE role = ?", [
            role,
        ]);

        // Cek Owner
        if (rows.length > 0) {
            console.log("Owner sudah ada.");
            process.exit(0);
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Owner
        await db.query(
            `
            INSERT INTO users
            (username, password, email, role)
            VALUES (?, ?, ?, ?)
            `,
            [username, hashedPassword, email, role],
        );

        console.log("Owner berhasil dibuat.");
        console.log("Username:", username);
        console.log("Password Hash:", hashedPassword);
        console.log("Password:", password);
        console.log("Email:", email);
    } catch (error) {
        console.error("Gagal membuat owner:", error);
    } finally {
        await db.end();
    }
}

seedOwner();
