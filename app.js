const express = require('express');
require('./dbConn');

const articlesController = require('./controllers/articles');
const usersController = require('./controllers/auth');

const articlesService = require('./services/articles');
const usersService = require('./services/users');

const app = express();

app.use(express.json());
app.use(articlesService());
app.use(usersService());

app.use('/articles', articlesController);
app.use('/user', usersController);

app.listen('3000', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('App listening on port 3000');
    }
})