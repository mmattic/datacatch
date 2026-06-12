const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/exports', require('./routes/exports'));

app.get('/', (req, res) => {
  res.json({ message: 'Cdiscount选品工具API服务运行中' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});