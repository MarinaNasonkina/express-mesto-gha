const { DocumentNotFoundError } = require('mongoose').Error;

const Card = require('../models/card');

const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const { CREATED_CODE } = require('../utils/constants');

function getCards(req, res, next) {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner._id.toString();

      if (ownerId !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужой пост');
      }

      Card.deleteOne(card)
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пост не найден'));
      } else {
        next(err);
      }
    });
}

function putLike(req, res, next) {
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
        next(new NotFoundError('Запрашиваемый пост не найден'));
      } else {
        next(err);
      }
    });
}

function deleteLike(req, res, next) {
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
        next(new NotFoundError('Запрашиваемый пост не найден'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
