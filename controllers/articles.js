const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const articles = await req.articles.getAll();
    res.json(articles);
});

router.post('/', async (req, res) => {
    const article = await req.articles.create(req.body);
    if (article.errors) {
        return res.status(400).json(article);
    }

    res.status(201).json(article);
});

router.get('/:id', async (req, res) => {
    const article = await req.articles.getById(req.params.id);

    if (article) {
        res.json(article);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

router.patch('/:id', async (req, res) => {
    const editedArticle = await req.articles.edit(req.params.id, req.body);

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