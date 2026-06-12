const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysisService');
const cdiscountApi = require('../services/cdiscountApi');

router.post('/competition', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少products数组' });
    }

    const result = analysisService.analyzeCompetition(products);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/profit-margin', (req, res) => {
  try {
    const { product, costPrice } = req.body;
    
    if (!product || !costPrice) {
      return res.status(400).json({ error: '缺少product或costPrice参数' });
    }

    const margin = analysisService.calculateProfitMargin(product, costPrice);
    res.json({ success: true, data: { margin: parseFloat(margin) || null } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/best-sellers', (req, res) => {
  try {
    const { products, topN = 5 } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少products数组' });
    }

    const bestSellers = analysisService.identifyBestSellers(products, parseInt(topN));
    res.json({ success: true, data: bestSellers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/price-trend', (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少products数组' });
    }

    const trend = analysisService.analyzePriceTrend(products);
    res.json({ success: true, data: trend });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/product-score', (req, res) => {
  try {
    const { product } = req.body;
    
    if (!product) {
      return res.status(400).json({ error: '缺少product参数' });
    }

    const score = analysisService.generateProductScore(product);
    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/report', async (req, res) => {
  try {
    const { keyword, products } = req.body;
    
    if (!keyword || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: '缺少keyword或products参数' });
    }

    const report = analysisService.generateAnalysisReport(products, keyword);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/full-analysis/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword) {
      return res.status(400).json({ error: '缺少关键词参数' });
    }

    const searchResult = await cdiscountApi.searchProducts(keyword, 1, 50);
    const products = searchResult.Products || [];
    
    const report = analysisService.generateAnalysisReport(products, keyword);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;