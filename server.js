// Bağımlılıksız yerel sunucu: node server.js  ->  http://localhost:3000
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=__dirname,DATA=path.join(ROOT,'data','progress.json');
const T={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml'};
const ok=f=>f===path.join(ROOT,'index.html')||f.startsWith(path.join(ROOT,'css')+path.sep)||f.startsWith(path.join(ROOT,'js')+path.sep);
const srv=http.createServer((req,res)=>{
  let u;try{u=decodeURIComponent(req.url.split('?')[0])}catch{res.writeHead(400).end();return}
  if(u==='/api/progress'){
    if(req.method==='POST'){let b='';req.on('data',c=>{b+=c;if(b.length>1e6)req.destroy()});
      req.on('end',()=>{try{JSON.parse(b);fs.mkdirSync(path.dirname(DATA),{recursive:true});fs.writeFileSync(DATA,b);res.writeHead(204).end()}catch{res.writeHead(400).end()}});return}
    fs.readFile(DATA,(e,d)=>{res.writeHead(200,{'Content-Type':T['.json'],'Cache-Control':'no-store'});res.end(e?'{}':d)});return}
  const f=path.join(ROOT,u==='/'?'index.html':u);
  if(!ok(f)){res.writeHead(404).end('404');return}
  fs.readFile(f,(e,d)=>{if(e){res.writeHead(404).end('404');return}res.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(d)});
});
let port=+process.env.PORT||3000;
srv.on('error',e=>{if(e.code==='EADDRINUSE'){port++;srv.listen(port,'127.0.0.1')}else throw e});
srv.on('listening',()=>console.log('Beyin Arcade çalışıyor: http://localhost:'+port));
srv.listen(port,'127.0.0.1');
