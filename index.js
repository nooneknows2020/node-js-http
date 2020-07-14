'use strict';
const http = require('http');
const pug = require('pug');
const auth = require('http-auth');

// Basic認証の設定。realm:Basic認証時に保護する領域の名前
const basic = auth.basic(
  { realm: 'Enquetes Area.'},
  (username, password, callback) => {
      callback(username === 'guest' && password === 'xaXZJQmE');
  }
);

const server = http.createServer(basic, (req, res) => {
  const now = new Date();
  console.info(`[${now}] Requested by ${req.connection.remoteAddress}]`);

  // ログアウト処理(パスが/logoutであるときにステータスコード401を返す)
  if(req.url === '/logout'){
    res.writeHead(401, {
      'Content-type': 'text/plain; charset=utf-8'
    });
    res.end('ログアウトしました');
    return;
  }

  res.writeHead(200, {
    'Content-type': 'text/html; charset=utf-8'
  });
  switch(req.method){
    case 'GET':
      // 別解
      let firstItem = 'あんぱん';
      let secondItem = 'クリームパン';
      // req.urlの値でアンケートの内容を振り分ける
      if(req.url === '/enquetes/yaki-shabu'){
        firstItem = '焼き肉';
        secondItem = 'しゃぶしゃぶ';
      }else if(req.url === '/enquetes/rice-bread'){
        firstItem = 'ごはん';
        secondItem = 'パン';
      }
      res.write(pug.renderFile('./form.pug',{
        path: req.url,
        firstItem: firstItem,
        secondItem: secondItem
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
