const express = require('express');
require('./dbConn');

const articlesController = require('./controllers/articles');
const usersController = require('./controllers/auth');

const authMiddleware = require('./middlewares/auth');
const cors = require("./middlewares/cors");

const usersService = require('./services/users');

const app = express();

app.use(express.json());
app.use(usersService());

app.use(authMiddleware());
app.use(cors());

app.use('/articles', articlesController);
app.use('/user', usersController);

app.listen(3030, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('App listening on port 3030');
    }
})