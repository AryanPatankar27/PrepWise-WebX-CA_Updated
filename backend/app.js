const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDatabase = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());


app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('PrepWise API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`Server running on port ${PORT}`);
});