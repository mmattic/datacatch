const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.post('/csv', (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少products数组' });
    }

    const headers = ['productId', 'title', 'brand', 'category', 'price', 'originalPrice', 'discount', 'rating', 'reviewsCount', 'salesRank', 'stock'];
    const rows = products.map(p => [
      p.productId || '',
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.brand || '',
      p.category || '',
      p.price || '',
      p.originalPrice || '',
      p.discount || '',
      p.rating || '',
      p.reviewsCount || '',
      p.salesRank || '',
      p.stock || ''
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const filename = `products_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../exports', filename);

    if (!fs.existsSync(path.join(__dirname, '../exports'))) {
      fs.mkdirSync(path.join(__dirname, '../exports'), { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent, 'utf-8');

    res.json({ success: true, filename, downloadUrl: `/api/exports/download/${filename}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../exports', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/json', (req, res) => {
  try {
    const { products, reportName } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少products数组' });
    }

    const data = {
      exportTime: new Date().toISOString(),
      reportName: reportName || '产品数据',
      count: products.length,
      products
    };

    const filename = `products_${Date.now()}.json`;
    const filePath = path.join(__dirname, '../exports', filename);

    if (!fs.existsSync(path.join(__dirname, '../exports'))) {
      fs.mkdirSync(path.join(__dirname, '../exports'), { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    res.json({ success: true, filename, downloadUrl: `/api/exports/download/${filename}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;