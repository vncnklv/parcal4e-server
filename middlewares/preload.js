module.exports = (api) => async (req, res, next) => {
    const article = await api.getById(req.params.id);

    if (article) {
        res.locals.article = article;
    } else {
        return res.status(404).json({ message: 'Not found' });
    }

    next();
}