const ownerMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "owner") {
        next();
    } else {
        return res.status(403).json({
            message: "Akses ditolak. Hanya owner yang memiliki akses.",
        });
    }
};

module.exports = ownerMiddleware;
