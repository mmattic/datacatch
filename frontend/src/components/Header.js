import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          <span style={styles.logo}>🛍️</span>
          Cdiscount选品工具
        </h1>
        <div style={styles.rightSection}>
          <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>搜索商品</Link>
            <Link to="/analysis" style={styles.navLink}>数据分析</Link>
            <Link to="/export" style={styles.navLink}>数据导出</Link>
          </nav>
          {user && (
            <div style={styles.userSection}>
              <span style={styles.userInfo}>欢迎, {user.username}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    fontSize: '1.8rem'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  nav: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    fontSize: '0.9rem',
    color: '#bdc3c7'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s'
  }
};

export default Header;