const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (useful for Render/Vercel)
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Database ─────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kidrove_workshop';

// ─── Mongoose Schemas (Prepared for later) ─────────────────────
const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  schemaFields: [{
    name: String,
    type: { type: String, enum: ['string', 'number', 'email'] },
    label: String,
    required: Boolean
  }],
  price: Number,
  dates: String,
  capacity: Number
});

const EnquirySchema = new mongoose.Schema({
  workshopId: { type: String, required: true },
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

const Workshop = mongoose.model('Workshop', WorkshopSchema, 'workshops');
const Enquiry = mongoose.model('Enquiry', EnquirySchema, 'enquiries');

console.log('[DB] Attempting to connect to MongoDB...');
// Added extra event listeners for debugging connection issues
mongoose.connection.on('connected', () => {
  console.log('[DB] Mongoose connection event: connected');
});
mongoose.connection.on('error', (err) => {
  console.error('[DB] Mongoose connection event: error', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('[DB] Mongoose connection event: disconnected');
});

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('[DB] MongoDB connected -> kidrove_workshop');
  })
  .catch((err) => {
    console.error('\n═══════════════════════════════════════════════════════');
    console.error('[DB] FATAL ERROR: MongoDB connection failed.');
    console.error(`   Reason: ${err.message}`);
    console.error('   Server cannot start without a database connection.');
    console.error('═══════════════════════════════════════════════════════\n');
    process.exit(1);
  });

// ─── Dynamic Validation Helper ────────────────────────────────
function validateDynamicData(data, workshop) {
  const errors = {};
  workshop.schemaFields.forEach(field => {
    const value = data[field.name];
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.name] = `${field.label} is required.`;
    } else if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.name] = `Please provide a valid email for ${field.label}.`;
      }
      if (field.type === 'number' && isNaN(Number(value))) {
        errors[field.name] = `${field.label} must be a valid number.`;
      }
    }
  });
  return errors;
}

// ─── Rate limiting (express-rate-limit) ────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registrations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registrations from this IP. Please try again later.' }
});

// Apply the general API limiter to all requests under /api
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'mongodb'
  });
});

// GET workshops (Dynamic metadata)
app.get('/api/workshops', async (req, res) => {
  try {
    const workshops = await Workshop.find();
    return res.json({ success: true, data: workshops });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch workshops.' });
  }
});

// GET enquiries (admin — for debugging)
app.get('/api/enquiries', async (req, res) => {
  try {
    const records = await Enquiry.find().sort({ createdAt: -1 }).limit(100).select('-ipAddress');
    return res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
});

// POST /api/enquiry — Dynamic Registration
app.post('/api/enquiry', enquiryLimiter, async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

  const { workshopId, formData } = req.body;
  if (!workshopId || !formData) {
    return res.status(400).json({ success: false, message: 'workshopId and formData are required.' });
  }

  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // Dynamic Validation
    const errors = validateDynamicData(formData, workshop);
    if (Object.keys(errors).length > 0) {
      console.log('[VALIDATION] Failed:', errors);
      return res.status(400).json({ success: false, errors });
    }

    const cleanData = {
      workshopId: workshop._id,
      formData: formData,
      ipAddress: ip,
    };

    const saved = await new Enquiry(cleanData).save();
    console.log(`[DB] Saved to MongoDB: ${saved._id} for workshop ${workshopId}`);
    return res.status(201).json({
      success: true,
      message: 'Registration successful! We will contact you within 24 hours.',
      data: { id: saved._id, createdAt: saved.createdAt },
    });
  } catch (err) {
    console.error('[ERROR] Error saving enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again in a moment.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nKidrove API Server running on http://localhost:${PORT}`);
  console.log(`   GET  /api/workshops   → List dynamic workshops`);
  console.log(`   POST /api/enquiry     → Register for workshop`);
  console.log(`   GET  /api/enquiries   → List all registrations`);
  console.log(`   GET  /api/health      → Server status\n`);
});
