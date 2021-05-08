const Callable = require('./Callable')

module.exports = class extends Callable {
  constructor(parent) {
    super()
    this.parent = parent;
  }

  batch(handler) {
    handler(this);
    return this;
  }

  end() {
    return this.parent;
  }
};
