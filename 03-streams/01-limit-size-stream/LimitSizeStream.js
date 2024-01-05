const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const size = chunk.length;
    if (size <= this.limit) {
      this.limit -= size;
      this.push(chunk);
      callback();
    } else {
      this.emit('error', new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
