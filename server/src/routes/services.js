import express from 'express';
import { getServices, getServiceBySlug, getCategories } from '../controllers/servicesController.js';

const router = express.Router();

// GET /api/services/categories - must be declared BEFORE /:slug to avoid conflict
router.get('/categories', getCategories);

// GET /api/services - browse, search, filter, sort, paginate
router.get('/', getServices);

// GET /api/services/:slug - single service detail with related recommendations
router.get('/:slug', getServiceBySlug);

export default router;
