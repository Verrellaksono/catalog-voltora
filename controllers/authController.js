const bcrypt = require("bcrypt");
const User = require("../models/User");

const loginUser = async (req, res) => {
    console.log("Sudah di controller")
    try {
        const { username, password } = req.body;

        // Validasi Data
        if (!username || !password) {
            return res.status(400).json({
                message: "Username dan Password tidak boleh kosong!",
            });
        }

        // Search User by username
        const user = await User.findByUsername(username);
        console.log(user);

        // Validasi User
        if (!user) {
            return res.status(401).json({
                message: "Username atau Password Tidak Ditemukan!",
            });
        }

        // Validasi Status Akun
        if (user.status === "inactive") {
            return res.status(403).json({
                message: "Akun Anda tidak aktif. Silakan hubungi owner.",
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        // Validasi Password
        if (!isMatch) {
            return res.status(401).json({
                message: "Password Salah",
            });
        }

        // Login Success
        return res.status(201).json({
            message: "Login berhasil!",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { loginUser };
