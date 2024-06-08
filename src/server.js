import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);
  console.log(method, url);
  const route = routes.find(route => {
    return route.method === method && route.path === url;
  })

  if(route) {    
    return route.handler(req, res);
  }
})

server.listen(3333);