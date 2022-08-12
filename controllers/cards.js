const Card = require('../models/card');
const CardNotFound = require('../custom errors/CardNotFound');

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
    } else {
      res.status(500).send({ message: `Ошибка сервера ${err}` });
    }
  });

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ cards }))
  .catch((err) => {
    res.status(500).send({ message: `Ошибка сервера ${err}` });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании карточки ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then((card) => res.status(200).send({ card }))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при постановке лайка ${err}` });
    } else {
      res.status(500).send({ message: `Ошибка сервера ${err}` });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true, runValidators: true },
)
  .orFail(() => {
    throw new CardNotFound();
  })
  .then((card) => res.status(200).send({ card }))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при снятии лайка ${err}` });
    } else {
      res.status(500).send({ message: `Ошибка сервера ${err}` });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
