const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const CardNotFound = require('../custom errors/CardNotFound');
const {
  ok, created, incorrectData, internalError,
} = require('../custom errors/error_status');

// const deleteCard = (req, res) => {
//   const { authorization } = req.headers;
//   const token = authorization.replace('Bearer ', '');
//   const payload = jwt.verify(token, 'some-secret-key');

//   req.user = payload;
//   return Card.findByIdAndRemove(req.params.cardId)
//     .orFail(() => {
//       throw new CardNotFound();
//     })
//     .then((card) => {
//       if (card.owner.toString() === req.user._id) {
//         return res.status(ok).send({ message: 'Карточка удалена' });
//       }
//       throw new Error();
//     })
//     .catch((err) => {
//       if (err.name === 'CardNotFound') {
//         res.status(err.status).send(err);
//       } else if (err.name === 'ValidationError' || err.name === 'CastError') {
//         res.status(incorrectData).send({
// message: `Переданы некорректные данные при удалении карточки ${err}` });
//       } else {
//         res.status(internalError).send({ message: `Ошибка сервера ${err}` });
//       }
//     });
// };

const deleteCard = (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, 'some-secret-key');

  req.user = payload;

  return Card.findById(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(res.status(ok).send({ message: 'Карточка удалена' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(err.status).send(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(incorrectData).send({ message: `Переданы некорректные данные при удалении карточки ${err}` });
      } else {
        res.status(internalError).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(ok).send({ cards }))
  .catch((err) => {
    res.status(internalError).send({ message: `Ошибка сервера ${err}` });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectData).send({ message: `Переданы некорректные данные при создании карточки ${err}` });
      } else {
        res.status(internalError).send({ message: `Ошибка сервера ${err}` });
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
  .then((card) => res.status(ok).send({ card }))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'CastError') {
      res.status(incorrectData).send({ message: `Переданы некорректные данные при постановке лайка ${err}` });
    } else {
      res.status(internalError).send({ message: `Ошибка сервера ${err}` });
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
  .then((card) => res.status(ok).send({ card }))
  .catch((err) => {
    if (err.name === 'CardNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'CastError') {
      res.status(incorrectData).send({ message: `Переданы некорректные данные при снятии лайка ${err}` });
    } else {
      res.status(internalError).send({ message: `Ошибка сервера ${err}` });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
