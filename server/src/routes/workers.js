import express from 'express';
import { getWorkers, getWorkerById, getCategories, getRecommendedWorkers } from '../controllers/workerController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/recommended', getRecommendedWorkers);
router.get('/', getWorkers);
router.get('/:id', getWorkerById);

export default router;
