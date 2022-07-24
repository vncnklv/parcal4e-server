const jwt = require('jsonwebtoken');
const secret = '0b021a00c62201fdb1e661b29a55ff51c8d68f23fdcfd1569a991d8ddf14c89e93143a75a16310f5e14211fdd8ab3778';

function generateToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };