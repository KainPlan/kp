import express from 'express';
import * as maps from '../controllers/maps';
import { authenticated, allowed } from '../middleware/auth';

const router: express.Router = express.Router();

router.get('/', authenticated, maps.getAll);
router.get('/:id([0-9a-fA-F]{24})', maps.get);
router.get('/search/:qry', maps.search);

router.post('/make', authenticated, maps.make);
router.put('/:id([0-9a-fA-F]{24})/update', authenticated, allowed, maps.update);

export default router;