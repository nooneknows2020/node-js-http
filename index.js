'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info(`[${now}] Requested by ${req.connection.remoteAddress}]`);
  res.writeHead(200, {
    'Content-type': 'text/html; charset=utf-8'
  });
  switch(req.method){
    case 'GET':
      //pugモジュールを利用して、form.pugを描画し、レスポンスに描き出す
      //テンプレートが変数を読み込むように変更
      res.write(pug.renderFile('./form.pug',{
        path: req.url,
        firstItem: '焼き肉',
        secondItem: 'しゃぶしゃぶ'
      }));
      res.end();
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(body);
        console.info(`[${now}] 投稿: ${decoded}`);
        res.write(`<h1>${decoded}が投稿されました</h1>`);
        res.end();
      });
      break;
    default:
      break;
  }
}).on('error', (e) =>{
  console.error(`[${new Date()}] Server Error`, e);
}).on('clientError', (e) =>{
  console.error(`[${new Date()}] Client Error`, e);
});
const port = 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});
