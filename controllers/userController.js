const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    try {
        // Get All Users
        const rows = await User.getAll();

        // Send Response
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gagal mengambil data user dari database.",
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const role = "employee";
        const status = "active";

        // Validasi Inputs
        if (!username || username.trim() === "") {
            return res.status(400).json({
                message: "Username tidak boleh kosong!",
            });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({
                message: "Email tidak boleh kosong!",
            });
        }
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Email tidak valid!",
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password minimal harus 6 karakter!",
            });
        }

        // Check duplicate username
        const existingUsername = await User.findByUsername(username.trim());
        if (existingUsername) {
            return res.status(400).json({
                message: "Username sudah digunakan!",
            });
        }

        // Check duplicate email
        const existingEmail = await User.findByEmail(email.trim());
        if (existingEmail) {
            return res.status(400).json({
                message: "Email sudah terdaftar!",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const insertId = await User.create({
            username: username.trim(),
            password: hashedPassword,
            email: email.trim(),
            role: role,
            status: status,
        });

        // Send Response
        return res.status(201).json({
            message: "User berhasil ditambahkan!",
            id: insertId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gagal menambahkan user.",
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, username, email, password, status } = req.body;

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID user tidak valid!",
            });
        }

        // Validasi Inputs
        if (!username || username.trim() === "") {
            return res.status(400).json({
                message: "Username tidak boleh kosong!",
            });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({
                message: "Email tidak boleh kosong!",
            });
        }
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Email tidak valid!",
            });
        }
        if (!status || (status !== "active" && status !== "inactive")) {
            return res.status(400).json({
                message: "Status tidak valid!",
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan.",
            });
        }

        // Prevent modifying owner data
        if (user.role === "owner") {
            return res.status(400).json({
                message: "Data owner tidak dapat diubah demi keamanan!",
            });
        }

        // Check duplicate username if changed
        if (username.trim() !== user.username) {
            const existingUsername = await User.findByUsername(username.trim());
            if (existingUsername) {
                return res.status(400).json({
                    message: "Username sudah digunakan!",
                });
            }
        }

        // Check duplicate email if changed
        if (email.trim() !== user.email) {
            const existingEmail = await User.findByEmail(email.trim());
            if (existingEmail) {
                return res.status(400).json({
                    message: "Email sudah terdaftar!",
                });
            }
        }

        let hashedPassword = null;
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password minimal harus 6 karakter!",
                });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update User
        await User.update({
            id: parseInt(id),
            username: username.trim(),
            password: hashedPassword,
            email: email.trim(),
            role: user.role, // Gunakan role asal dari database
            status: status,
        });

        // Send Response
        return res.status(200).json({
            message: "User berhasil diperbarui!",
        });
    } catch (error) {
        console.error("Gagal memperbarui user:", error);
        return res.status(500).json({
            message: "Gagal memperbarui data user di database.",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findById(id);

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID user wajib disertakan!",
            });
        }

        // Prevent Delete Owner
        if (userToDelete && userToDelete.role === "owner") {
            return res.status(400).json({
                message: "Data owner tidak dapat dihapus demi keamanan!",
            });
        }

        // Delete User
        const affectedRows = await User.delete(id);

        // Check User Deleted
        if (affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan atau sudah dihapus.",
            });
        }

        // Send Response
        return res.status(200).json({
            message: "User berhasil dihapus!",
        });
    } catch (error) {
        console.error("Gagal menghapus user:", error);
        return res.status(500).json({
            message: "Gagal menghapus user dari database.",
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
