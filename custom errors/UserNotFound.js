const UnauthorizedError = require('./UnauthorizedError');

class UserNotFound extends UnauthorizedError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}

module.exports = UserNotFound;
