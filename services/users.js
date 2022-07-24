const bcrypt = require('bcrypt');
const Blacklist = require('../models/Blacklist');

const User = require("../models/User");

const { generateToken } = require('../utils');

async function register({ username, password, repeatPassword }) {
    const existing = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

    const errors = {};

    if (existing) errors.username = "Username is taken!";

    if (password != repeatPassword) {
        errors.password = "Passwords does not match!";
        errors.repeatPassword = "Passwords does not match!";
    }

    if (!!Object.keys(errors).length) return { errors };

    try {
        const user = new User({ username, password });
        await user.save();
        return { token: generateToken({ userId: user._id, username: user.username }) };
    } catch (err) {
        Object.values(err.errors).map(e => Object.assign(errors, { [e.path]: e.properties.message }));
        return { errors };
    }
}

async function login(username, password) {
    const user = await User.findOne({ username });

    let passwordsMatch = false;

    if (user) passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) return null;

    return generateToken({ userId: user._id, username: user.username });
}

async function logout(token) {
    try {
        const blacklistItem = new Blacklist({ token: token.value, expireAt: token.exp });
        await blacklistItem.save();
    } catch (err) {
        console.error(err);
    }
}

module.exports = () => (req, res, next) => {
    req.users = {
        login,
        register,
        logout,
    }
    next();
};