import express from 'express';
import passport from 'passport';
import * as users from '../controllers/users';
import { authenticated } from '../middleware/auth';

const router: express.Router = express.Router();

router.post('/auth', passport.authenticate('local'), users.auth);
router.get('/info', authenticated, users.info);
router.post('/register', users.register);
router.post('/logout', users.logout);

export default router;