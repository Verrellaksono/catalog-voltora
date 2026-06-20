const activeMiddleware = (req, res, next) => {
    if (req.user && req.user.status === "active") {
        next();
    } else {
        return res.status(403).json({
            message: "Akun Anda dalam keadaan tidak aktif. Silakan login kembali.",
            redirect: "/login",
        });
    }
};

module.exports = activeMiddleware;
