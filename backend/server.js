const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
// Need large limits for base64 encoded images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/wardrobe', require('./routes/wardrobeRoutes'));
app.use('/ai', require('./routes/aiRoutes'));
app.use('/outfits', require('./routes/outfitRoutes'));
app.use('/wishlist', require('./routes/wishlistRoutes'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB connection error:', err));
