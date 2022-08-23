class ConflictError extends Error {
  constructor(status = 409, message = 'Пользователь уже существует') {
    super();
    this.statusCode = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = ConflictError;
