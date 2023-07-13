const {
  CastError,
  ValidationError,
  DocumentNotFoundError,
} = require('mongoose').Error;

const Card = require('../models/card');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

function getCards(req, res) {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: `Переданы некорректные данные: ${Object.values(err.errors).join(', ')}`,
          });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при удалении карточки',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при постановке лайка',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при снятии лайка',
        });
        return;
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
