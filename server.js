const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { initializeAdminUser } = require('./services/userService');

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API服务运行正常' });
});

async function startServer() {
  try {
    await initializeAdminUser();
  } catch (err) {
    console.warn('Could not initialize admin user:', err.message);
  }
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
}

startServer();

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});