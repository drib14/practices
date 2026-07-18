import { Worker } from '../models/Worker.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

/**
 * @desc    Get paginated, filtered, sorted list of active workers
 * @route   GET /api/workers
 */
export const getWorkers = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      minRating,
      minExperience,
      minPrice,
      maxPrice,
      sort = 'recommended',
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = { status: 'Active' };

    // Search: full text or regex
    if (search && typeof search === 'string') {
      const sanitized = search.trim().replace(/\s+/g, ' ');
      if (sanitized.length > 0) {
        const escaped = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        filter.$or = [
          { fullName: regex },
          { displayName: regex },
          { skills: regex },
          { categories: regex },
          { city: regex }
        ];
      }
    }

    if (category && typeof category === 'string') {
      filter.categories = new RegExp(`^${category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    if (city && typeof city === 'string') {
      filter.city = new RegExp(city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }

    if (minExperience) {
      filter.yearsExperience = { $gte: parseInt(minExperience, 10) };
    }

    if (minPrice || maxPrice) {
      filter.startingPrice = {};
      if (minPrice) filter.startingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.startingPrice.$lte = parseFloat(maxPrice);
    }

    const sortOptions = {
      recommended: { averageRating: -1, completedJobs: -1 },
      nearest: { city: 1 }, // simplified nearest
      highestRated: { averageRating: -1 },
      mostExperienced: { yearsExperience: -1 },
      lowestPrice: { startingPrice: 1 },
      highestPrice: { startingPrice: -1 },
      recentlyJoined: { createdAt: -1 }
    };

    const sortOrder = sortOptions[sort] || sortOptions.recommended;

    const skip = (pageNum - 1) * limitNum;
    const [workers, totalCount] = await Promise.all([
      Worker.find(filter)
        .select('-__v')
        .sort(sortOrder)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Worker.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: 'Workers retrieved successfully',
      data: workers,
      meta: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    logger.error('Error fetching workers', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get single worker by ID with related recommendations
 * @route   GET /api/workers/:id
 */
export const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid worker ID' });
    }

    const worker = await Worker.findOne({ _id: id, status: 'Active' })
      .select('-__v')
      .lean();

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Related workers: same categories
    const related = await Worker.find({
      _id: { $ne: worker._id },
      status: 'Active',
      categories: { $in: worker.categories }
    })
      .select('_id displayName profilePhoto verificationStatus categories averageRating startingPrice city')
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      message: 'Worker details retrieved',
      data: {
        ...worker,
        similarWorkers: related
      }
    });
  } catch (error) {
    logger.error('Error fetching worker by ID', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get distinct active categories
 * @route   GET /api/workers/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Worker.distinct('categories', { status: 'Active' });
    categories.sort();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching categories', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get recommended workers
 * @route   GET /api/workers/recommended
 */
export const getRecommendedWorkers = async (req, res) => {
  try {
    const recommended = await Worker.find({ status: 'Active' })
      .sort({ averageRating: -1, completedJobs: -1 })
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      message: 'Recommended workers retrieved successfully',
      data: recommended
    });
  } catch (error) {
    logger.error('Error fetching recommended workers', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
