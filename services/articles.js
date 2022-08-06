const Article = require('../models/Article');


async function create(data) {
    const article = new Article({
        images: data.images,
        name: data.name,
        age_group: data.age_group,
        description: data.description,
        gender: data.gender,
        available_sizes: data.available_sizes,
        color: data.color,
        price: data.price,
        sizes: data.sizes,
        brand: data.brand,
        _ownerId: data._ownerId
    });

    try {
        await article.save();
        return article;
    } catch (err) {
        const errors = {};
        Object.values(err.errors).map(e => Object.assign(errors, { [e.path]: e.properties.message }));
        return { errors };
    }
}

async function getAll(ageGroup, gender, page, limit) {
    return Article.find({
        'age_group': new RegExp(`^${ageGroup}$`, 'i'),
        'gender': new RegExp(`^${gender}$`, 'i')
    })
        .skip((page - 1) * limit)
        .limit(limit);
}

async function getMaxPages(ageGroup, gender, limit) {
    const documentsCount = await Article.find({ 'age_group': ageGroup, 'gender': gender }).count();
    console.log(documentsCount, limit);
    return Math.ceil(documentsCount / limit);
}

async function getById(id) {
    try {
        const article = await Article.findById(id);
        return article;
    } catch (err) {
        return null;
    }
}

async function edit(id, data) {
    try {
        const article = await Article.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
        return article;
    } catch (err) {
        const errors = {};
        Object.values(err.errors).map(e => Object.assign(errors, { [e.path]: e.properties.message }));
        return { errors };
    }
}

async function del(id, data) {
    const article = await Article.findByIdAndDelete(id);
    return article;
}

async function getMostLiked() {
    const mostLiked = await Article.find({}).sort({ likes: -1 }).limit(5);
    return mostLiked;
}

async function addLike(articleId, userId) {
    const article = await Article.findById(articleId);

    if (!article) return { message: 'Article not found!' };
    if (article.likedBy.includes(userId)) return { message: 'Article is already liked by this user!' };

    article.likedBy.push(userId);
    article.likes++;

    await article.save();

    return article;
}

async function removeLike(articleId, userId) {
    const article = await Article.findById(articleId);

    if (!article) return { message: 'Article not found!' };
    if (!article.likedBy.includes(userId)) return { message: 'Article is not liked by this user!' };

    article.likedBy.splice(article.likedBy.indexOf(userId), 1);
    article.likes--;

    await article.save();

    return article;
}


module.exports = {
    getAll,
    create,
    getById,
    edit,
    del,
    getMostLiked,
    getMaxPages,
    addLike,
    removeLike
}
