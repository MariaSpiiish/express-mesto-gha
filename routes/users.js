/* eslint-disable linebreak-style */
const router = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);

module.exports = router;
