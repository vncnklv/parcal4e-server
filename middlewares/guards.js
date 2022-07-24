module.exports = {
    isAuth: () => (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Please log in' });
        next();
    },
    isOwner: () => (req, res, next) => {
        if(req.user.id != res.locals.article._ownerId) return res.status(403).json({ message: 'You are not the owner of this article!' });
        next();
    }
}