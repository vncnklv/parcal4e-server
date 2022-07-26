const express = require('express');

const { isAuth, isOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');

const api = require('../services/articles');

const router = express.Router();

router.get('/', async (req, res) => {
    const ageGroup = req.query['age_group'] || 'adult';
    const gender = req.query.gender;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const [articles, maxPages] = await Promise.all([
        api.getAll(ageGroup, gender, page, limit),
        api.getMaxPages(ageGroup, gender, limit)
    ]);
    res.json({
        result: articles,
        max_pages: maxPages
    });
});

router.get('/most-liked', async (req, res) => {
    const articles = await api.getMostLiked();
    res.json(articles);
})

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
    const deletedArticle = await api.del(req.params.id);

    if (!deletedArticle) return res.status(404).json({ message: 'Not found' });

    res.json(deletedArticle);
});

router.get('/:id/like', isAuth(), async (req, res) => {
    const articleId = req.params.id;
    const article = await api.addLike(articleId, req.user.id);
    res.json(article);
});

router.get('/:id/dislike', isAuth(), async (req, res) => {
    const articleId = req.params.id;
    const article = await api.removeLike(articleId, req.user.id);
    res.json(article);
});

module.exports = router;