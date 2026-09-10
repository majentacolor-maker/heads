import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/music.js':'music.js','/dialogue.js':'dialogue.js','/melodies.js':'melodies.js','/style.css':'style.css','/face.png':'face.png','/face-frames.png':'face-frames.png','/yellow.png':'yellow.png','/pink.png':'pink.png','/yellow-frames.png':'yellow-frames.png','/pink-frames.png':'pink-frames.png'};
const types={html:'text/html',js:'text/javascript',css:'text/css',png:'image/png'};
http.createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404).end();return}try{const data=await readFile(new URL(`./dist/${file}`,import.meta.url));res.writeHead(200,{'Content-Type':types[file.split('.').pop()]});res.end(data)}catch{res.writeHead(500).end('Asset unavailable')}}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'));
