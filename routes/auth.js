const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const ADMIN_USER = {
  username: 'jcc',
  password: '333666'
};

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '请输入用户名和密码' });
  }
  
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign(
      { username: ADMIN_USER.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.json({
      success: true,
      message: '登录成功',
      token,
      user: { username: ADMIN_USER.username, role: 'admin' }
    });
  }
  
  res.status(401).json({ success: false, message: '用户名或密码错误' });
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供 token' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'token 无效或已过期' });
    }
    
    res.json({
      success: true,
      user: { username: decoded.username, role: decoded.role }
    });
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: '退出登录成功' });
});

module.exports = router;