const Article = require('../models/Article');

async function getAll() {
    return Article.find({});
}

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

module.exports = {
    getAll,
    create,
    getById,
    edit,
    del
}
