const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username not provided!'],
        minLength: [3, 'Username must have atleast 3 characters!'],
    },
    password: {
        type: String,
        required: [true, 'Password not provided!'],
        minLength: [3, 'Password must have atleast 3 characters!']
    }
});

userSchema.virtual('repeatPassword').set(function (value) {
    if (this.password !== value) {
        throw new Error('Repeat password should match password');
    }
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 1
    }
});

const User = model('User', userSchema);

module.exports = User;