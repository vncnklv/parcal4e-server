const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/parcal4e', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Database connected!");
}