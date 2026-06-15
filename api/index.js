const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/auth', require('../routes/auth'));
app.use('/products', require('../routes/products'));
app.use('/analysis', require('../routes/analysis'));
app.use('/exports', require('../routes/exports'));

module.exports = app;