import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AnalysisPage() {
  const [keyword, setKeyword] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await axios.get(`/api/analysis/full-analysis/${encodeURIComponent(keyword.trim())}`);
      
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (err) {
      setError('分析失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const priceData = report?.competition ? [
    { name: '最低价格', value: parseFloat(report.competition.minPrice) },
    { name: '平均价格', value: parseFloat(report.competition.avgPrice) },
    { name: '最高价格', value: parseFloat(report.competition.maxPrice) }
  ] : [];

  const COLORS = ['#3498db', '#e74c3c', '#2ecc71'];

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <h2 style={styles.heading}>商品数据分析</h2>
        <div style={styles.searchBox}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="输入关键词进行分析..."
            style={styles.input}
          />
          <button onClick={handleAnalyze} style={styles.button}>
            分析
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading && <div style={styles.loading}>分析中...</div>}

      {!loading && report && (
        <div style={styles.report}>
          <div style={styles.reportHeader}>
            <h3 style={styles.reportTitle}>分析报告: {report.keyword}</h3>
            <span style={styles.reportDate}>{new Date(report.generatedAt).toLocaleString()}</span>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{report.totalProducts}</div>
              <div style={styles.statLabel}>商品总数</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>€{report.competition?.avgPrice}</div>
              <div style={styles.statLabel}>平均价格</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{report.competition?.avgRating}</div>
              <div style={styles.statLabel}>平均评分</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{report.priceTrend?.discountPercentage}%</div>
              <div style={styles.statLabel}>折扣商品占比</div>
            </div>
          </div>

          <div style={styles.chartSection}>
            <h4 style={styles.chartTitle}>价格分布</h4>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartSection}>
            <h4 style={styles.chartTitle}>价格区间</h4>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {priceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {report.bestSellers && report.bestSellers.length > 0 && (
            <div style={styles.bestSellers}>
              <h4 style={styles.chartTitle}>畅销商品 TOP 5</h4>
              <div style={styles.bestSellersList}>
                {report.bestSellers.map((product, index) => (
                  <div key={index} style={styles.bestSellerItem}>
                    <span style={styles.rank}>{index + 1}</span>
                    <div style={styles.bestSellerInfo}>
                      <div style={styles.bestSellerTitle}>{product.title}</div>
                      <div style={styles.bestSellerPrice}>€{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.recommendations && report.recommendations.length > 0 && (
            <div style={styles.recommendations}>
              <h4 style={styles.chartTitle}>选品建议</h4>
              <ul style={styles.recommendationsList}>
                {report.recommendations.map((rec, index) => (
                  <li key={index} style={styles.recommendationItem}>
                    <span style={styles.bullet}>✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
  searchBox: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '500px'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
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
  report: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  reportTitle: {
    fontSize: '1.25rem',
    color: '#2c3e50'
  },
  reportDate: {
    color: '#95a5a6',
    fontSize: '0.875rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#7f8c8d',
    marginTop: '0.5rem'
  },
  chartSection: {
    marginBottom: '2rem'
  },
  chartTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  chartContainer: {
    height: '250px'
  },
  bestSellers: {
    marginBottom: '2rem'
  },
  bestSellersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  bestSellerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  rank: {
    width: '2rem',
    height: '2rem',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  bestSellerInfo: {
    flex: 1
  },
  bestSellerTitle: {
    fontSize: '0.875rem',
    color: '#2c3e50',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  bestSellerPrice: {
    fontSize: '0.875rem',
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  recommendations: {
    backgroundColor: '#e8f5e9',
    padding: '1rem',
    borderRadius: '8px'
  },
  recommendationsList: {
    listStyle: 'none',
    padding: 0
  },
  recommendationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0'
  },
  bullet: {
    color: '#2ecc71',
    fontWeight: 'bold'
  }
};

export default AnalysisPage;