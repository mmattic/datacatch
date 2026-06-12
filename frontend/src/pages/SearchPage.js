import { useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchInput from '../components/SearchInput';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError('');
    setProducts([]);
    setPage(1);
    setHasMore(true);

    try {
      const response = await axios.get('/api/products/search', {
        params: { keyword: keyword.trim(), page: 1, pageSize: 20 }
      });
      
      if (response.data.success) {
        setProducts(response.data.data.Products || []);
        setHasMore(response.data.data.Products && response.data.data.Products.length === 20);
      }
    } catch (err) {
      setError('搜索失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    
    try {
      const response = await axios.get('/api/products/search', {
        params: { keyword: keyword.trim(), page: page + 1, pageSize: 20 }
      });
      
      if (response.data.success) {
        const newProducts = response.data.data.Products || [];
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
        setHasMore(newProducts.length === 20);
      }
    } catch (err) {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <h2 style={styles.heading}>搜索商品</h2>
        <SearchInput 
          value={keyword} 
          onChange={setKeyword} 
          onSearch={handleSearch}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading && <div style={styles.loading}>加载中...</div>}

      {!loading && products.length > 0 && (
        <>
          <div style={styles.productGrid}>
            {products.map(product => (
              <ProductCard key={product.ProductId} product={product} />
            ))}
          </div>
          
          {hasMore && (
            <div style={styles.loadMore}>
              <button onClick={handleLoadMore} style={styles.button}>
                加载更多
              </button>
            </div>
          )}
        </>
      )}

      {!loading && products.length === 0 && !error && keyword && (
        <div style={styles.empty}>暂无商品数据</div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  searchSection: {
    marginBottom: '2rem'
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#2c3e50'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  loadMore: {
    textAlign: 'center',
    marginTop: '2rem'
  },
  button: {
    padding: '0.75rem 2rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999'
  }
};

export default SearchPage;