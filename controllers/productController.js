const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const getProducts = async (req, res) => {
    try {
        // Get All Products
        const rows = await Product.getAll();

        // Send Response
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gagal mengambil data produk dari database.",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, category_id, price, description } = req.body;
        const user_id = req.user.id;

        // Validasi Name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Nama produk tidak boleh kosong!",
            });
        }

        // Validasi Price
        if (price === undefined || price === null || price === "") {
            return res.status(400).json({
                message: "Harga produk tidak boleh kosong!",
            });
        }

        // Validasi Price Must Positif
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                message: "Harga produk harus berupa angka positif!",
            });
        }

        // Validasi Category ID
        if (!category_id || category_id.trim() === "") {
            return res.status(400).json({
                message: "Kategori produk tidak boleh kosong!",
            });
        }

        // Validasi Image
        if (!req.file) {
            return res.status(400).json({
                message: "Gambar produk wajib diunggah!",
            });
        }

        // Handle Image
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }


        // Create Product
        const insertId = await Product.create({
            name: name.trim(),
            category_id: parseInt(category_id),
            user_id: user_id,
            price: parsedPrice,
            description: description ? description.trim() : null,
            image: imagePath,
        });

        // Send Response
        return res.status(201).json({
            message: "Produk berhasil ditambahkan",
            id: insertId,
        });
    } catch (error) {
        console.error(error);
        // Hapus file gambar yang terlanjur di-upload jika terjadi error database
        if (req.file) {
            const filePath = path.join(__dirname, "../public/uploads", req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Gagal menghapus file saat rollback error:", err);
            });
        }
        return res.status(500).json({
            message: "Gagal membuat produk",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        const { name, category_id, price, description } = req.body;

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID produk tidak valid!",
            });
        }

        // Validasi Name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Nama produk tidak boleh kosong!",
            });
        }

        // Validasi Price
        if (price === undefined || price === null || price === "") {
            return res.status(400).json({
                message: "Harga produk tidak boleh kosong!",
            });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                message: "Harga produk harus berupa angka positif!",
            });
        }

        // Check Product Exist
        const product = await Product.findById(id);
        if (!product) {
            // Hapus file yang baru saja diupload jika produknya tidak ada
            if (req.file) {
                const filePath = path.join(__dirname, "../public/uploads", req.file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Gagal menghapus file saat rollback error:", err);
                });
            }
            return res.status(404).json({
                message: "Produk tidak ditemukan.",
            });
        }

        // Handle Image
        let imagePath = product.image;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;

            // Hapus file gambar lama jika ada
            if (product.image) {
                const oldFilePath = path.join(__dirname, "../public", product.image);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error("Gagal menghapus file gambar lama:", err);
                });
            }
        }

        // Update Product
        const updateResult = await Product.update({
            id: parseInt(id),
            category_id: category_id ? parseInt(category_id) : null,
            name: name.trim(),
            description: description ? description.trim() : null,
            price: parsedPrice,
            image: imagePath,
        });

        if (updateResult === 0 && imagePath === product.image) {
            return res.status(404).json({
                message: "Produk tidak ditemukan atau tidak ada perubahan data.",
            });
        }

        // Send Response
        return res.status(200).json({
            message: "Produk berhasil diperbarui!",
        });
    } catch (error) {
        console.error("Gagal memperbarui produk:", error);
        // Hapus file gambar yang terlanjur di-upload jika terjadi error database
        if (req.file) {
            const filePath = path.join(__dirname, "../public/uploads", req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Gagal menghapus file saat rollback error:", err);
            });
        }
        return res.status(500).json({
            message: "Gagal memperbarui data produk di database.",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                message: "ID produk wajib disertakan!",
            });
        }

        // Cari data produk untuk mendapatkan file path gambar
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Produk tidak ditemukan atau sudah dihapus.",
            });
        }

        // Delete Product
        const deleteResult = await Product.delete(id);

        if (deleteResult === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan atau sudah dihapus.",
            });
        }

        // Hapus file gambar produk dari disk jika ada
        if (product.image) {
            const filePath = path.join(__dirname, "../public", product.image);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Gagal menghapus file gambar produk dari disk:", err);
            });
        }

        // Send Response
        return res.status(200).json({
            message: "Produk berhasil dihapus!",
        });
    } catch (error) {
        console.error("Gagal menghapus produk:", error);

        return res.status(500).json({
            message: "Gagal menghapus produk dari database.",
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
