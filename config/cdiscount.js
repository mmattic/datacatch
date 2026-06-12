module.exports = {
  tokenUrl: 'https://api.cdiscount.com/OpenApi/json/AccessToken',
  productUrl: 'https://api.cdiscount.com/OpenApi/json/GetProduct',
  categoryUrl: 'https://api.cdiscount.com/OpenApi/json/GetCategoryProducts',
  searchUrl: 'https://api.cdiscount.com/OpenApi/json/Search',
  clientId: process.env.CDISCOUNT_CLIENT_ID,
  clientSecret: process.env.CDISCOUNT_CLIENT_SECRET,
  rateLimit: {
    requestsPerMinute: 100,
    delayMs: 600
  },
  batchSize: 20
};