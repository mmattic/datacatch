const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  console.error('Please set JWT_SECRET in your .env file before starting the application');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权访问，请先登录' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'token 无效或已过期' });
    }
    
    req.user = decoded;
    next();
  });
}

function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权访问，请先登录' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'token 无效或已过期' });
    }
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: '无管理员权限' });
    }
    
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken,
  authenticateAdmin
};