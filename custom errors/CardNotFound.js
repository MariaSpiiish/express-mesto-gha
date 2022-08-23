const UnauthorizedError = require('./UnauthorizedError');

class CardNotFound extends UnauthorizedError {
  constructor() {
    super(404, 'Карточка с указанным id не найдена');
  }
}

module.exports = CardNotFound;
