const express = require('express');

const router = express.Router();

router.post('/login', async (req, res) => {
    const token = await req.users.login(req.body.username, req.body.password);

    if (!token) return res.status(400).json({ message: 'Wrong username or password!' });

    res.json({ token });
});

router.post('/register', async (req, res) => {
    const { username, password, repeatPassword } = req.body;

    if (password !== repeatPassword) return res.status(400).json({ message: 'Passwords does not match!' });

    const result = await req.users.register(username, password);

    if (result.errors) {
        return res.status(400).json(result);
    }

    res.json(result);
});

module.exports = router;
