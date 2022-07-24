const express = require('express');
const { isAuth } = require('../middlewares/guards');

const router = express.Router();

router.post('/login', async (req, res) => {
    const token = await req.users.login(req.body.username, req.body.password);

    if (!token) return res.status(400).json({ message: 'Wrong username or password!' });

    res.json({ token });
});

router.post('/register', async (req, res) => {
    const userData = req.body;

    const result = await req.users.register(userData);

    if (result.errors) {
        return res.status(400).json(result);
    }

    res.json(result);
});

router.get('/logout', isAuth(), async (req, res) => {
    await req.users.logout(req.user.token);
    res.json({ message: 'Success!' })
});

module.exports = router;
