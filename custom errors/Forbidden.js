class Forbidden extends Error {
  constructor(status = 403, message = 'Вы не можете удалить карточку другого пользователя') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = Forbidden;
