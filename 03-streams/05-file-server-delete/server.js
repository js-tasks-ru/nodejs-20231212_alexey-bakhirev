const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const server = new http.Server();

function getSendOnlyCodeFun(response) {
  return (code) => {
    response.statusCode = code;
    response.end();
  };
}

server.on('request', async (req, res) => {
  const sendCode = getSendOnlyCodeFun(res);

  if (req.method !== 'DELETE') {
    sendCode(501);
    return;
  }

  const pathParts = req.url.split('/').slice(1);
  if (pathParts.length !== 1) {
    sendCode(400);
    return;
  }

  const filepath = path.join(__dirname, 'files', pathParts[0]);
  fs.stat(filepath, (err, stat) => {
    if (err || stat.isFIFO()) {
      sendCode(404);
      return;
    }

    fs.unlink(filepath, (err) => {
      if (err) {
        sendCode(500);
      } else {
        sendCode(200);
      }
    });
  });
});

module.exports = server;
