const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { validateAuthData, validateUser } = require('./middlewares/validation-joi');
const centralHandleErr = require('./middlewares/central-handle-err');

const { login, createUser } = require('./controllers/users');

const users = require('./routes/users');
const cards = require('./routes/cards');

const NotFoundError = require('./errors/not-found-err');

const { PORT, DB_URL } = require('./utils/constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.post('/signin', validateAuthData, login);
app.post('/signup', validateUser, createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(centralHandleErr);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.listen(PORT);
