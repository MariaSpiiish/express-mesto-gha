const User = require('../models/user');
const UserNotFound = require('../custom errors/UserNotFound');

const getUser = (req, res) => User.findById(req.params.userId)
  .orFail(() => {
    throw new UserNotFound();
  })
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'UserNotFound') {
      res.status(err.status).send(err);
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
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

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send(err);
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send(err);
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, updateProfile, updateAvatar,
};
