const { CastError } = require('mongoose').Error;

const Card = require('../models/card');

const {
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
    .then((card) => res.send(card))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new CastError('');
      }
      res.send({ message: 'Пост удалён' });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
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
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.path === 'likes') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при постановке лайка',
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
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
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.path === 'likes') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при снятии лайка' });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пост не найден' });
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
