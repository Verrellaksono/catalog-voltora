const express = require("express");
const router = express.Router();

// Import Controller
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// Import Middleware
const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");
const activeMiddleware = require("../middleware/activeMiddleware");
const upload = require("../middleware/uploadMiddleware");

const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
};

// Auth API
router.post("/login", authController.loginUser);

// Categories API
router.get("/categories", categoryController.getCategories);
router.post("/categories", authMiddleware, activeMiddleware, categoryController.createCategory);
router.put("/categories/:id", authMiddleware, activeMiddleware, categoryController.updateCategory);
router.delete("/categories/:id", authMiddleware, activeMiddleware, categoryController.deleteCategory);

// Products API
router.get("/products", productController.getProducts);
router.post("/products", authMiddleware, activeMiddleware, uploadSingle("image"), productController.createProduct);
router.put("/products/:id", authMiddleware, activeMiddleware, uploadSingle("image"), productController.updateProduct);
router.delete("/products/:id", authMiddleware, activeMiddleware, productController.deleteProduct);

// Users API
router.get("/users", authMiddleware, activeMiddleware, ownerMiddleware, userController.getUsers);
router.post("/users", authMiddleware, activeMiddleware, ownerMiddleware, userController.createUser);
router.put("/users/:id", authMiddleware, activeMiddleware, ownerMiddleware, userController.updateUser);
router.delete("/users/:id", authMiddleware, activeMiddleware, ownerMiddleware, userController.deleteUser);

module.exports = router;
