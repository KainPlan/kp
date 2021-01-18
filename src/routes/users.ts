import express from 'express';
import passport from 'passport';
import * as users from '../controllers/users';
import { authenticated } from '../middleware/auth';

const router: express.Router = express.Router();

router.post('/auth', passport.authenticate('local'), users.auth);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', ], }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', }), users.googleCallback);
router.get('/info', authenticated, users.info);
router.post('/register', users.register);
router.post('/logout', users.logout);

export default router;