const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../middlewares/validation-joi');

router.get('/', getCards);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, putLike);

router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
