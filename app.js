const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { NOT_FOUND_ERROR } = require('./utils/constants');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ad58a1e9fd7109afdd5ff5',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.use('/', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.listen(PORT);
