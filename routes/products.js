const express = require('express');
const router = express.Router();
const cdiscountApi = require('../services/cdiscountApi');
const db = require('../config/database');

router.get('/search', async (req, res) => {
  try {
    const { keyword, page = 1, pageSize = 20 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: '缺少关键词参数' });
    }

    const result = await cdiscountApi.searchProducts(keyword, parseInt(page), parseInt(pageSize));
    
    db.saveSearchHistory(keyword);

    res.json({
      success: true,
      data: result,
      keyword,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cdiscountApi.getProductById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: '缺少productIds数组' });
    }

    const results = await cdiscountApi.getProductsByIds(productIds);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;
    
    const result = await cdiscountApi.getCategoryProducts(categoryId, parseInt(page), parseInt(pageSize));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;