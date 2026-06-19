const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Database ─────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kidrove_workshop';
let isMongoConnected = false;

const EnquirySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 100 },
  email:     { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  phone:     { type: String, required: true, trim: true, maxlength: 20 },
  workshop:  { type: String, default: 'AI & Robotics Summer Workshop 2026' },
  createdAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

const Enquiry = mongoose.model('Enquiry', EnquirySchema, 'enquiries');

// In-memory fallback
const memoryDb = [];

console.log('🔌 Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✅ MongoDB connected → kidrove_workshop');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('\n═══════════════════════════════════════════════════════');
    console.warn('⚠️  MongoDB unavailable — running in Memory Mode');
    console.warn(`   Reason: ${err.message}`);
    console.warn('   All registrations will be stored in memory only.');
    console.warn('═══════════════════════════════════════════════════════\n');
  });

// ─── Validation helpers ───────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()\u0900-\u097F]{10,15}$/;

function validateEnquiry(body) {
  const errors = {};
  const { name, email, phone } = body;

  if (!name || !name.trim())          errors.name  = 'Name is required.';
  else if (name.trim().length < 2)    errors.name  = 'Name must be at least 2 characters.';
  else if (name.trim().length > 100)  errors.name  = 'Name is too long (max 100 chars).';

  if (!email || !email.trim())            errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please provide a valid email address.';

  if (!phone || !phone.trim())            errors.phone = 'Phone number is required.';
  else if (!PHONE_REGEX.test(phone.trim())) errors.phone = 'Please provide a valid phone number (10–15 digits).';

  return errors;
}

// ─── Rate limiting (simple in-memory) ────────────────────────
const rateLimit = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, reset: now + 60000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60000; }
  entry.count++;
  rateLimit.set(ip, entry);
  return entry.count <= 5; // max 5 per minute
}

// ─── Routes ───────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'mongodb' : 'memory',
    records: isMongoConnected ? null : memoryDb.length,
    workshop: 'AI & Robotics Summer Workshop 2026',
  });
});

// GET enquiries (admin — for debugging)
app.get('/api/enquiries', async (req, res) => {
  try {
    if (isMongoConnected) {
      const records = await Enquiry.find().sort({ createdAt: -1 }).limit(100).select('-ipAddress');
      return res.json({ success: true, count: records.length, data: records });
    } else {
      return res.json({ success: true, count: memoryDb.length, data: [...memoryDb].reverse() });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
});

// POST /api/enquiry — Register student
app.post('/api/enquiry', async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute before trying again.',
    });
  }

  // Validate
  const errors = validateEnquiry(req.body);
  if (Object.keys(errors).length > 0) {
    console.log('❌ Validation failed:', errors);
    return res.status(400).json({ success: false, errors });
  }

  const cleanData = {
    name:     req.body.name.trim(),
    email:    req.body.email.trim().toLowerCase(),
    phone:    req.body.phone.trim(),
    workshop: 'AI & Robotics Summer Workshop 2026',
    ipAddress: ip,
  };

  try {
    if (isMongoConnected) {
      // Check for duplicate email in this workshop
      const existing = await Enquiry.findOne({ email: cleanData.email });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered for the workshop. Our team will be in touch!',
        });
      }
      const saved = await new Enquiry(cleanData).save();
      console.log(`✅ Saved to MongoDB: ${saved._id} — ${cleanData.name} <${cleanData.email}>`);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! We will contact you within 24 hours.',
        data: { id: saved._id, name: saved.name, email: saved.email, createdAt: saved.createdAt },
      });
    } else {
      // Memory mode
      const doc = {
        _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        ...cleanData,
        createdAt: new Date(),
      };
      // Check duplicate in memory
      const existingMem = memoryDb.find(r => r.email === cleanData.email);
      if (existingMem) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered! Our team will be in touch soon.',
        });
      }
      memoryDb.push(doc);
      console.log(`✅ Saved to Memory: ${doc._id} — ${cleanData.name} <${cleanData.email}>`);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! (Note: server is in demo mode — connect MongoDB for persistence)',
        data: { id: doc._id, name: doc.name, email: doc.email, createdAt: doc.createdAt },
      });
    }
  } catch (err) {
    console.error('💥 Error saving enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again in a moment.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Kidrove API Server running on http://localhost:${PORT}`);
  console.log(`   POST /api/enquiry     → Register student`);
  console.log(`   GET  /api/enquiries   → List all registrations`);
  console.log(`   GET  /api/health      → Server status\n`);
});
