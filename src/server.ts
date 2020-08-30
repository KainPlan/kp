import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import next from 'next';
import http from 'http';
import Server from 'next/dist/next-server/server/next-server';

import users from './routes/users';

const dev = process.env.NODE_ENV !== 'production';
const server: Server = next({ dev });
const handle = server.getRequestHandler();

server.prepare().then(() => {
  const app: express.Application = express();
  const httpServer: http.Server = http.createServer(app);

  app.use(cookieParser());
  app.use(bodyParser.json());

  const api: express.Router = express.Router();

  api.use('/users', users);

  app.use('/api', api);
  app.get('*', (req, res) => handle(req, res));

  httpServer.listen(3000, () => console.log(`[APP]: Listening on http://localhost:3000 ... `));
}).catch(e => {
  console.error(e);
  process.exit(1);
});