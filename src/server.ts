import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import next from 'next';
import http from 'http';
import Server from 'next/dist/next-server/server/next-server';
import 'dot-env';
import session from 'express-session';
import uid from 'uid-safe';
import passport from 'passport';
import GoogleOAuth2 from 'passport-google-oauth20';
import { Strategy } from 'passport-local';
import * as auth from './middleware/auth';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string;
      PORT: string;
      DOMAIN: string;
      RES_PATH: string;

      MGUSER: string;
      MGHOST: string;
      MGPASSWORD: string;
      MGDATABASE: string;
      MGPORT: number;

      GOOGLE_OAUTH_CLIENTID: string;
      GOOGLE_OAUTH_SECRET: string;
    }
  }
}

import users from './routes/users';
import User from './models/User';
import maps from './routes/maps';
import utils from './utils';

const dev = process.env.NODE_ENV !== 'production';
const server: Server = next({ dev });
const handle = server.getRequestHandler();

server.prepare().then(() => {
  const app: express.Application = express();
  const httpServer: http.Server = http.createServer(app);

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb', }));
  app.use(session({
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000,
    },
    resave: false,
    saveUninitialized: false,
  }));

  passport.use(new Strategy(User.verify));
  passport.serializeUser((user: User, cb) => cb(null, user.id));
  passport.deserializeUser((id: number, cb) => User.load(+id).then(user => cb(null, user)).catch(err => cb(err)));

  passport.use(new GoogleOAuth2.Strategy({
      clientID: process.env.GOOGLE_OAUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken, profile);
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  const api: express.Router = express.Router();
  api.use('/users', users);
  api.use('/maps', maps);
  api.use('/maps', express.static(process.env.RES_PATH));
  
  app.use('/api', api);
  app.use('/api', (req, res) => utils.respond(res, 404, 'not_found'));
  
  app.use('/*/dashboard', auth.authenticatedOrRedirect);
  app.get('*', (req, res) => handle(req, res));

  httpServer.listen(+process.env.PORT, process.env.HOST, () => console.log(`[APP]: Listening on http://${process.env.HOST}:${process.env.PORT}... `));
}).catch(e => {
  console.error(e);
  process.exit(1);
});