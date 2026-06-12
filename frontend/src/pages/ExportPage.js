import { useState } from 'react';
import axios from 'axios';

function ExportPage() {
  const [keyword, setKeyword] = useState('');
  const [exportType, setExportType] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExport = async () => {
    if (!keyword.trim()) {
      setError('请输入搜索关键词');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const searchResponse = await axios.get('/api/products/search', {
        params: { keyword: keyword.trim(), page: 1, pageSize: 100 }
      });

      if (!searchResponse.data.success) {
        throw new Error('搜索失败');
      }

      const products = searchResponse.data.data.Products || [];
      
      if (products.length === 0) {
        setError('没有找到商品数据');
        return;
      }

      const formattedProducts = products.map(p => ({
        productId: p.ProductId,
        title: p.Title,
        brand: p.Brand,
        category: p.Category,
        price: p.Price,
        originalPrice: p.OriginalPrice,
        discount: p.Discount,
        rating: p.Rating,
        reviewsCount: p.ReviewsCount,
        salesRank: p.SalesRank,
        stock: p.Stock
      }));

      const exportResponse = await axios.post(`/api/exports/${exportType}`, {
        products: formattedProducts,
        reportName: `Cdiscount_${keyword}_${new Date().toISOString().split('T')[0]}`
      });

      if (exportResponse.data.success) {
        setSuccess(`导出成功！文件已生成：${exportResponse.data.filename}`);
        
        setTimeout(() => {
          window.location.href = exportResponse.data.downloadUrl;
        }, 1000);
      }
    } catch (err) {
      setError('导出失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.exportSection}>
        <h2 style={styles.heading}>数据导出</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>搜索关键词</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入关键词搜索商品"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>导出格式</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            style={styles.select}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <button onClick={handleExport} style={styles.button} disabled={loading}>
          {loading ? '导出中...' : '导出数据'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
      </div>

      <div style={styles.infoSection}>
        <h3 style={styles.infoTitle}>导出说明</h3>
        <ul style={styles.infoList}>
          <li>支持导出CSV和JSON两种格式</li>
          <li>每次最多导出100条商品数据</li>
          <li>CSV文件可直接用Excel打开</li>
          <li>JSON文件包含完整的商品信息</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  },
  exportSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#2c3e50'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#7f8c8d',
    fontSize: '0.875rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: '#fff'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2ecc71',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  infoSection: {
    marginTop: '2rem',
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px'
  },
  infoTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  infoList: {
    listStyle: 'disc',
    paddingLeft: '1.5rem',
    color: '#7f8c8d'
  }
};

export default ExportPage;