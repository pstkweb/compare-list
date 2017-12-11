module.exports = function NotFoundError(msg, errCode) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = msg || 'The requested resource could not be found';
  this.statusCode = 404;
  this.errorCode = errCode || 404;
};
