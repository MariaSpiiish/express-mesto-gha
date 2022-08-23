class DuplicateError extends Error {
  constructor(message = 'Пользователь уже существует') {
    super();
    this.status = 409;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = DuplicateError;
