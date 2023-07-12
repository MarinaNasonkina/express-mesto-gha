const { CastError, ValidationError } = require('mongoose').Error;

const User = require('../models/user');

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function getUserById(req, res) {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
};
