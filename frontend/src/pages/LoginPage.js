import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.loginBox}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>🛍️</div>
          <h1 style={styles.title}>Cdiscount选品工具</h1>
          <p style={styles.subtitle}>欢迎回来，请登录您的账户</p>
        </div>
        
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>用户名</label>
            <div style={{...styles.inputWrapper, borderColor: focusedField === 'username' ? '#3498db' : '#e0e0e0'}}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                disabled={loading}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>密码</label>
            <div style={{...styles.inputWrapper, borderColor: focusedField === 'password' ? '#3498db' : '#e0e0e0'}}>
              <span style={styles.inputIcon}>🔑</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                disabled={loading}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={styles.input}
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} style={styles.loginBtn}>
            {loading ? (
              <span style={styles.loadingSpinner}></span>
            ) : (
              '登 录'
            )}
          </button>
        </form>
        
        <div style={styles.hintBox}>
          <div style={styles.hintTitle}>默认账号信息</div>
          <div style={styles.hintContent}>
            <span style={styles.hintLabel}>用户名：</span>
            <span style={styles.hintValue}>jcc</span>
          </div>
          <div style={styles.hintContent}>
            <span style={styles.hintLabel}>密码：</span>
            <span style={styles.hintValue}>333666</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    animation: 'gradientShift 8s ease infinite'
  },
  loginBox: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px 50px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '420px',
    backdropFilter: 'blur(10px)'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logo: {
    fontSize: '56px',
    marginBottom: '15px',
    animation: 'bounce 2s ease infinite'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    margin: 0
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#ffebee',
    borderLeft: '4px solid #e53935',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  errorIcon: {
    fontSize: '18px'
  },
  errorText: {
    fontSize: '14px',
    color: '#c62828',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#34495e'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '0 16px',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa'
  },
  inputIcon: {
    fontSize: '18px',
    marginRight: '12px',
    color: '#95a5a6'
  },
  input: {
    flex: 1,
    height: '48px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    backgroundColor: 'transparent',
    color: '#2c3e50',
    placeholderColor: '#bdc3c7'
  },
  loginBtn: {
    height: '52px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  hintBox: {
    marginTop: '25px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  hintTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: '12px'
  },
  hintContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  hintLabel: {
    fontSize: '14px',
    color: '#6c757d'
  },
  hintValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    fontFamily: 'monospace',
    background: '#e9ecef',
    padding: '2px 8px',
    borderRadius: '4px'
  }
};

export default LoginPage;