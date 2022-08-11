/* eslint-disable linebreak-style */
class ApplicationError extends Error {
  constructor(status = 500, message = 'Ошибка сервера') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = ApplicationError;
