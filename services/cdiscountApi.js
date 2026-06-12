const axios = require('axios');
const config = require('../config/cdiscount');

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && tokenExpiry && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(config.tokenUrl, {
      parameters: {
        Login: config.clientId,
        Password: config.clientSecret
      }
    });

    if (response.data.Success && response.data.Token) {
      accessToken = response.data.Token;
      tokenExpiry = now + 3600000;
      return accessToken;
    } else {
      throw new Error(response.data.ErrorMessage || 'Failed to get token');
    }
  } catch (error) {
    throw new Error(`Token fetch error: ${error.message}`);
  }
}

async function searchProducts(keyword, page = 1, pageSize = 20) {
  const token = await getAccessToken();
  
  try {
    const response = await axios.post(config.searchUrl, {
      parameters: {
        Keyword: keyword,
        PageNumber: page,
        PageSize: pageSize
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Search error: ${error.message}`);
  }
}

async function getProductById(productId) {
  const token = await getAccessToken();
  
  try {
    const response = await axios.post(config.productUrl, {
      parameters: {
        ProductIds: [productId]
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Product fetch error: ${error.message}`);
  }
}

async function getProductsByIds(productIds) {
  const token = await getAccessToken();
  const batches = [];
  
  for (let i = 0; i < productIds.length; i += config.batchSize) {
    batches.push(productIds.slice(i, i + config.batchSize));
  }

  const results = [];
  for (const batch of batches) {
    await new Promise(resolve => setTimeout(resolve, config.rateLimit.delayMs));
    
    try {
      const response = await axios.post(config.productUrl, {
        parameters: {
          ProductIds: batch
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.Products) {
        results.push(...response.data.Products);
      }
    } catch (error) {
      console.error(`Batch fetch error: ${error.message}`);
    }
  }

  return results;
}

async function getCategoryProducts(categoryId, page = 1, pageSize = 20) {
  const token = await getAccessToken();
  
  try {
    const response = await axios.post(config.categoryUrl, {
      parameters: {
        CategoryId: categoryId,
        PageNumber: page,
        PageSize: pageSize
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Category products error: ${error.message}`);
  }
}

module.exports = {
  searchProducts,
  getProductById,
  getProductsByIds,
  getCategoryProducts
};