/* eslint-disable linebreak-style */
const User = require('../models/user');
const UserNotFound = require('../custom errors/UserNotFound');

const getUser = (req, res) => User.findById(req.params.id)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'UserNotFound') {
      res.status(err.status).send(err);
    } else {
      res.status(500).send({ message: `Ошибка сервера ${err}` });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    res.status(500).send({ message: `Ошибка сервера ${err}` });
  });

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports = { createUser, getUser, getUsers };
