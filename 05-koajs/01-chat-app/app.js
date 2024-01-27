const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class Queue {
  constructor(defaultDelayInSecond) {
    this._defaultDelay = defaultDelayInSecond || 29;
    this._requests = [];
    this._timer = setInterval(() => {
      this._removeOldSubscribe();
    }, 1000);
  }

  addSubscribe(ctx, next) {
    this._requests.push({ctx, next, delay: this._defaultDelay});
  }

  _sendResponse(subscribe, message) {
    subscribe.ctx.status = 200;
    subscribe.ctx.body = message || '';
    subscribe.next();
  }

  _removeOldSubscribe() {
    this._requests = this._requests.filter((subscribe) => {
      subscribe.delay -= 1;
      const needRemove = subscribe.delay <= 0;
      if (needRemove) {
        this._sendResponse(subscribe);
      }
      return !needRemove;
    });
  }

  addMessage(message) {
    if (!message) return;
    this._requests.forEach((subscribe) => {
      this._sendResponse(subscribe, message);
    });
    this._requests = [];
  }
}

const chatQueue = new Queue(29);

router.get('/subscribe', async (ctx, next) => {
  return new Promise((res, rej) => {
    chatQueue.addSubscribe(ctx, () => {
      res();
      next();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  setTimeout(() => {
    chatQueue.addMessage(message || '');
  });
  ctx.status = 200;
  next();
});

app.use(router.routes());

module.exports = app;
