const express = require("express");
const router = express.Router();
const path = require("path");

// Homepage
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Login
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/auth/login.html"));
});

// Categories
router.get("/categories", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/categories.html"));
});

// Products
router.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/products.html"));
});

// Users
router.get("/users", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/users.html"));
});

module.exports = router;

