const jwt = (require('jsonwebtoken'));

const userAuthentication = (req, res, next) => {
    try {
         
        // Get the token from cookies
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = userAuthentication;