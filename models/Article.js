const { Schema, model, Types: { ObjectId } } = require('mongoose');

const articleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Article must have name'],
        minLength: [3, 'Article name must be atleast 3 characters']
    },
    images: {
        type: [String],
        required: true,
        validate: [(v) => Array.isArray(v) && v.length > 0, 'Article must have atleast one image']
    },
    age_group: {
        type: String,
        required: true,
        enum: {
            values: ['adult', 'kids'],
            message: '{VALUE} is not supported age group!'
        }
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported gender!'
        }
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Article description must be atleast 10 characters']
    },
    sizes: {
        type: [String],
        required: true,
        validate: [(v) => Array.isArray(v) && v.length > 0, 'Article must have atleast one size']
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Article price cannot be smaller than 1']
    },
    color: {
        type: String,
        required: true,
        minLength: [3, 'Article color must be atleast 3 characters']
    },
    brand: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    _ownerId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
});

const Article = model('Article', articleSchema);

module.exports = Article;