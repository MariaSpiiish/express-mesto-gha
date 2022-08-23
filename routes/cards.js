const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i),
    about: Joi.string().min(2).max(30),
  }),
}), createCard);

router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).required(),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
