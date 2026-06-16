const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../services/userService');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '请输入用户名和密码' });
  }
  
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
    
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.json({
      success: true,
      message: '登录成功',
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
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