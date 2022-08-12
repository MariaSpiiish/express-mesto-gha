const ApplicationError = require('./ApplicationError');

class CardNotFound extends ApplicationError {
  constructor() {
    super(404, 'Карточка с указанным id не найдена');
  }
}

module.exports = CardNotFound;
