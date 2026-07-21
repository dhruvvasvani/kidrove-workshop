const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kidrove_workshop';

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

const Workshop = mongoose.model('Workshop', WorkshopSchema, 'workshops');

const memoryWorkshops = [
  {
    title: 'AI & Robotics Summer Workshop 2026',
    description: 'Learn the fundamentals of AI and build your first robot!',
    price: 150,
    dates: 'July 15 - July 20, 2026',
    capacity: 30,
    schemaFields: [
      { name: 'name', type: 'string', label: 'Student Full Name', required: true },
      { name: 'email', type: 'email', label: 'Parent Email', required: true },
      { name: 'phone', type: 'string', label: 'Phone Number', required: true },
      { name: 'age', type: 'number', label: 'Student Age', required: true }
    ]
  },
  {
    title: 'Advanced Web Development Bootcamp',
    description: 'Master React, TypeScript, and Node.js in this intensive bootcamp.',
    price: 300,
    dates: 'August 1 - August 30, 2026',
    capacity: 20,
    schemaFields: [
      { name: 'name', type: 'string', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email Address', required: true },
      { name: 'experienceLevel', type: 'string', label: 'Experience Level (Beginner/Intermediate/Pro)', required: true },
      { name: 'github', type: 'string', label: 'GitHub Username', required: false }
    ]
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    const count = await Workshop.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Seeding workshops...');
      await Workshop.insertMany(memoryWorkshops);
      console.log('Seeding successful!');
    } else {
      console.log('Database already seeded.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
