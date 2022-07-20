const bcrypt = require('bcrypt');

const User = require("../models/User");

const { generateToken } = require('../utils');

async function register(username, password) {
    try {
        const user = new User({ username, password });
        await user.save();
        return { token: generateToken({ userId: user._id, username: user.username }) };
    } catch (err) {
        const errors = {};
        Object.values(err.errors).map(e => Object.assign(errors, { [e.path]: e.properties.message }));
        return { errors };
    }
}

async function login(username, password) {
    const user = await User.findOne({ username });

    console.log(user);

    let passwordsMatch = false;

    if (user) passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) return null;

    return generateToken({ userId: user._id, username: user.username });
}

module.exports = () => (req, res, next) => {
    req.users = {
        login,
        register
    }
    next();
};