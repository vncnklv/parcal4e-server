const Blacklist = require("../models/Blacklist");
const { verifyToken } = require("../utils");

const userMiddleware = () => async (req, res, next) => {
    const token = req.header('X-Authorization');

    if (token) {
        try {
            const blacklisted = await Blacklist.findOne({ token });

            if (blacklisted) throw new Error();

            const decodedToken = verifyToken(token);

            req.user = {
                id: decodedToken.userId,
                username: decodedToken.username,
                token: {
                    value: token,
                    exp: new Date(decodedToken.exp * 1000)
                }
            };

        } catch (err) {
            return res.status(401).json({ message: 'Invalid access token. Please log in' });
        }
    }

    next();
}

module.exports = userMiddleware;