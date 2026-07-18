import { Service } from '../models/Service.js';
import { logger } from '../utils/logger.js';

/**
 * @desc    Get paginated, filtered, sorted list of active services
 * @route   GET /api/services
 */
export const getServices = async (req, res) => {
  try {
    // Whitelist query parameters
    const allowedParams = ['search', 'category', 'serviceArea', 'minPrice', 'maxPrice', 'sort', 'page', 'limit'];
    const queryKeys = Object.keys(req.query);
    const invalidParams = queryKeys.filter((key) => !allowedParams.includes(key));

    if (invalidParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid query parameters: ${invalidParams.join(', ')}`
      });
    }

    const {
      search,
      category,
      serviceArea,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    // Build query — only ACTIVE services are visible
    const filter = { status: 'ACTIVE' };

    // Search: case-insensitive regex across title, shortDescription, tags, and category
    if (search && typeof search === 'string') {
      const sanitized = search.trim().replace(/\s+/g, ' ');
      if (sanitized.length > 0) {
        const escaped = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        filter.$or = [
          { title: regex },
          { shortDescription: regex },
          { category: regex },
          { tags: regex }
        ];
      }
    }

    // Category filter
    if (category && typeof category === 'string') {
      filter.category = new RegExp(`^${category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    // Service area filter
    if (serviceArea && typeof serviceArea === 'string') {
      filter.serviceArea = new RegExp(serviceArea.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.startingPrice = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) filter.startingPrice.$gte = min;
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) filter.startingPrice.$lte = max;
      }
      // Clean up empty price filter
      if (Object.keys(filter.startingPrice).length === 0) {
        delete filter.startingPrice;
      }
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceAsc: { startingPrice: 1 },
      priceDesc: { startingPrice: -1 },
      alphabetical: { title: 1 }
    };

    const sortOrder = sortOptions[sort] || sortOptions.newest;

    // Execute query with pagination
    const skip = (pageNum - 1) * limitNum;
    const [services, totalCount] = await Promise.all([
      Service.find(filter)
        .select('-__v')
        .sort(sortOrder)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Service.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: services,
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
    logger.error('Error fetching services', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get single service by slug with related recommendations
 * @route   GET /api/services/:slug
 */
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid service slug' });
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const service = await Service.findOne({ slug: sanitizedSlug, status: 'ACTIVE' })
      .select('-__v')
      .lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Related services: same category or same provider, excluding current service
    const related = await Service.find({
      _id: { $ne: service._id },
      status: 'ACTIVE',
      $or: [
        { category: service.category },
        { providerId: service.providerId }
      ]
    })
      .select('slug title category providerName startingPrice shortDescription thumbnail')
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      message: 'Service details retrieved',
      data: {
        ...service,
        relatedServices: related
      }
    });
  } catch (error) {
    logger.error('Error fetching service by slug', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get distinct active categories
 * @route   GET /api/services/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category', { status: 'ACTIVE' });
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
