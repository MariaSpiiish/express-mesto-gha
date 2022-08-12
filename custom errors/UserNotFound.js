const ApplicationError = require('./ApplicationError');

class UserNotFound extends ApplicationError {
  constructor() {
    super(400, 'Пользователь не найден');
  }
}

module.exports = UserNotFound;
