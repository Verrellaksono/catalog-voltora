const Category = require("../models/Category");

const getCategories = async (req, res) => {
    try {
        // Get All Categories
        const rows = await Category.getAll();

        // Send Response
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gagal mengambil data kategori dari database.",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const user_id = req.user.id;

        // Validasi Name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Nama kategori tidak boleh kosong!",
            });
        }

        // Create Category
        const insertId = await Category.create({
            name: name.trim(),
            user_id: user_id,
        });

        // Send Response
        return res.status(201).json({
            message: "Kategori berhasil dibuat",
            id: insertId,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gagal membuat kategori",
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID kategori wajib disertakan!",
            });
        }

        // Delete Category
        const deleteCategory = await Category.delete(id);

        // Check Category Deleted
        if (deleteCategory === 0) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan atau sudah dihapus.",
            });
        }

        // Send Response
        return res.status(200).json({
            message: "Kategori berhasil dihapus!",
        });
    } catch (error) {
        console.error("Gagal menghapus kategori:", error);

        return res.status(500).json({
            message: "Gagal menghapus kategori dari database.",
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID kategori tidak valid!",
            });
        }

        // Validasi Name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Nama kategori tidak boleh kosong!",
            });
        }

        // Update Category
        const updateCategory = await Category.update({
            id,
            name: name.trim(),
        });

        // Check Category Updated
        if (updateCategory === 0) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan.",
            });
        }

        // Send Response
        return res.status(200).json({
            message: "Kategori berhasil diperbarui!",
        });
    } catch (error) {
        console.error("Gagal memperbarui kategori:", error);

        return res.status(500).json({
            message: "Gagal memperbarui data kategori di database.",
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
};
