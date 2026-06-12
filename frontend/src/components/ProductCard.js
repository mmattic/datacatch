function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img 
          src={product.ImagePath} 
          alt={product.Title}
          style={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200';
          }}
        />
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{product.Title}</h3>
        <p style={styles.brand}>{product.Brand}</p>
        <div style={styles.priceContainer}>
          <span style={styles.price}>€{product.Price?.toFixed(2) || 'N/A'}</span>
          {product.OriginalPrice && product.OriginalPrice > product.Price && (
            <span style={styles.originalPrice}>€{product.OriginalPrice.toFixed(2)}</span>
          )}
        </div>
        <div style={styles.rating}>
          <span>⭐ {product.Rating || 'N/A'}</span>
          <span style={styles.reviews}>({product.ReviewsCount || 0} 评价)</span>
        </div>
        <div style={styles.salesRank}>
          销售排名: {product.SalesRank || 'N/A'}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  imageContainer: {
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  info: {
    padding: '1rem'
  },
  title: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  brand: {
    fontSize: '0.875rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#e74c3c'
  },
  originalPrice: {
    fontSize: '0.875rem',
    color: '#95a5a6',
    textDecoration: 'line-through'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  reviews: {
    fontSize: '0.875rem',
    color: '#95a5a6'
  },
  salesRank: {
    fontSize: '0.875rem',
    color: '#7f8c8d'
  }
};

export default ProductCard;