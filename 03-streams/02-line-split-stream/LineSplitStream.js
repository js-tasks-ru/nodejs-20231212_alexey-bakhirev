const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.text = '';
  }

  _transform(chunk, encoding, callback) {
    this.text += chunk.toString();

    if (!this.text.includes(os.EOL)) {
      callback();
      return;
    }

    const parts = this.text.split(os.EOL);
    this.text = parts.pop();

    parts.map((text) => this.push(text));
    callback();
  }

  _flush(callback) {
    this.push(this.text);
    this.text = '';
    callback();
  }
}

module.exports = LineSplitStream;
