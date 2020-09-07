import express from 'express';
import * as maps from '../controllers/maps';

const router: express.Router = express.Router();

router.get('/:id([0-9a-fA-F]{24})', maps.get);
router.get('/search/:qry', maps.search);

export default router;