const express = require('express');

const { isAuth, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');

const api = require('../services/articles');

const router = express.Router();

router.get('/', async (req, res) => {
    const articles = await api.getAll();
    res.json(articles);
});

router.post('/', isAuth(), async (req, res) => {
    const article = await api.create({ ...req.body, _ownerId: req.user.id });
    if (article.errors) {
        return res.status(400).json(article);
    }

    res.status(201).json(article);
});

router.get('/:id', preload(api), async (req, res) => {
    res.json(res.locals.article);
});

router.patch('/:id', isAuth(), preload(api), isOwner(), async (req, res) => {
    const editedArticle = await api.edit(req.params.id, req.body);

    if (editedArticle.errors) return res.status(400).json(editedArticle);
    if (!editedArticle) return res.status(404).json({ message: 'Not found' });

    res.json(editedArticle);
});

router.delete('/:id', async (req, res) => {
    const deletedArticle = await req.articles.del(req.params.id);

    if (!deletedArticle) return res.status(404).json({ message: 'Not found' });

    res.json(deletedArticle);
});

module.exports = router;