import express from 'express';
import * as users from '../controllers/users';

const router: express.Router = express.Router();

router.post('/login', users.login);
router.post('/register', users.register);

export default router;