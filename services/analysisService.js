function calculateProfitMargin(product, costPrice) {
  if (!product.price || !costPrice) return null;
  return ((product.price - costPrice) / product.price * 100).toFixed(2);
}

function analyzeCompetition(products) {
  if (!products || products.length === 0) return null;

  const prices = products.map(p => p.price).filter(Boolean);
  const ratings = products.map(p => p.rating).filter(Boolean);
  
  return {
    totalProducts: products.length,
    avgPrice: prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0,
    minPrice: prices.length > 0 ? Math.min(...prices).toFixed(2) : 0,
    maxPrice: prices.length > 0 ? Math.max(...prices).toFixed(2) : 0,
    avgRating: ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0,
    priceStdDev: prices.length > 0 ? calculateStdDev(prices).toFixed(2) : 0
  };
}

function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function identifyBestSellers(products, topN = 5) {
  if (!products || products.length === 0) return [];
  
  return [...products]
    .filter(p => p.salesRank && p.salesRank > 0)
    .sort((a, b) => a.salesRank - b.salesRank)
    .slice(0, topN);
}

function analyzePriceTrend(products) {
  if (!products || products.length === 0) return null;

  const discounted = products.filter(p => p.discount && p.discount > 0);
  const avgDiscount = discounted.length > 0 
    ? (discounted.reduce((a, b) => a + b.discount, 0) / discounted.length).toFixed(2) 
    : 0;

  return {
    totalDiscounted: discounted.length,
    avgDiscount: parseFloat(avgDiscount),
    discountPercentage: ((discounted.length / products.length) * 100).toFixed(2)
  };
}

function generateProductScore(product) {
  let score = 0;
  let factors = [];

  if (product.rating && product.rating >= 4.0) {
    score += 25;
    factors.push('高评分');
  }
  
  if (product.reviewsCount && product.reviewsCount >= 100) {
    score += 20;
    factors.push('评价数量多');
  }
  
  if (product.discount && product.discount > 10) {
    score += 15;
    factors.push('有折扣');
  }
  
  if (product.salesRank && product.salesRank < 1000) {
    score += 20;
    factors.push('销售排名靠前');
  }
  
  if (product.stock && product.stock > 50) {
    score += 20;
    factors.push('库存充足');
  }

  return {
    score: Math.min(score, 100),
    factors
  };
}

function generateAnalysisReport(products, keyword) {
  const competition = analyzeCompetition(products);
  const bestSellers = identifyBestSellers(products);
  const priceTrend = analyzePriceTrend(products);
  
  return {
    keyword,
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    competition,
    bestSellers: bestSellers.map(p => ({
      productId: p.productId,
      title: p.title,
      price: p.price,
      salesRank: p.salesRank,
      rating: p.rating
    })),
    priceTrend,
    recommendations: generateRecommendations(products, competition)
  };
}

function generateRecommendations(products, competition) {
  const recommendations = [];
  
  if (competition && competition.avgPrice > 50) {
    recommendations.push('该品类平均价格较高，可考虑差异化定价策略');
  }
  
  if (competition && competition.avgRating < 3.5) {
    recommendations.push('市场整体评价偏低，有机会通过提升产品质量获得竞争优势');
  }
  
  const lowCompetition = products.filter(p => p.rating && p.rating >= 4.5).length;
  if (lowCompetition < products.length * 0.2) {
    recommendations.push('高评分产品占比低，可关注品质提升机会');
  }

  return recommendations;
}

module.exports = {
  calculateProfitMargin,
  analyzeCompetition,
  identifyBestSellers,
  analyzePriceTrend,
  generateProductScore,
  generateAnalysisReport
};