module.exports = function requireAuth(req, res, next) {
    // Prevent cached protected pages after logout
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    if (!req.session.user) {
        // Block /home path for non-authenticated users
        if (req.path === '/home') {
            return res.redirect("/login");
        }
        // For API requests, return JSON
        if (req.path.startsWith('/videos') && (req.method === 'POST' || req.method === 'GET')) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        return res.redirect("/login");
    }
    next();
};
