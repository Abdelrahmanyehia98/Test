require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err.message));


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.get('/search', async (req, res) => {
  try {
      const { min_price, max_price, location, area, rentOrBuy, type } = req.body;
      const filters = {};
      if (min_price) filters.price = { ...filters.price, $gte: parseFloat(min_price) };
      if (max_price) filters.price = { ...filters.price, $lte: parseFloat(max_price) };
      if (location) filters.location = { $regex: location, $options: 'i' };
      if (area) filters.area = { $gte: parseFloat(area) };
      if (rentOrBuy) filters.rentOrBuy = rentOrBuy;
      if (type) filters.type = type;

      const ads = await Ad.find(filters);

      res.status(200).json(ads);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log(`Server running on port 5000`));