import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocalization } from './LocalizationContext';
import './Login.css';

const API = import.meta.env.VITE_API_URL || '';

function Login({ onLogin }) {
  const { t, setLang, lang } = useLocalization();
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const authResponse = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: pass }),
      });

      if (!authResponse.ok) {
        const result = await authResponse.json();
        setErrorMessage(result.message || t('login_error'));
        return;
      }

      const { token } = await authResponse.json();
      localStorage.setItem('token', token);
      onLogin(token);
    } catch (err) {
      console.warn('Auth issue:', err);
      setErrorMessage('Nätverksfel. Kontrollera din anslutning.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <img src="/diamond.png" alt="Company Logo" className="nav-logo" />
          </div>
          
          <div className="nav-right">
            <div className="nav-links hide-mobile">
              <a href="#home">Hem</a>
              <a href="#order">Beställ</a>
              <a href="#customers">Våra Kunder</a>
              <a href="#about">Om oss</a>
              <a href="#contact">Kontakta oss</a>
            </div>
            
            <div className="flags">
              <div className="lang-selector-trigger" onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}>
                <span className="lang-text">{lang === 'sv' ? 'Svenska' : 'English'}</span>
                <img src={lang === 'sv' ? '/SE.png' : '/GB.png'} alt="Selected flag" />
              </div>
              
              {isLangDropdownOpen && (
                <div className="lang-dropdown-card">
                  <div className="lang-option" onClick={() => { setLang('sv'); setIsLangDropdownOpen(false); }}>
                    <span>Svenska</span>
                    <img src="/SE.png" alt="Sverige" />
                  </div>
                  <div className="lang-option" onClick={() => { setLang('en'); setIsLangDropdownOpen(false); }}>
                    <span>English</span>
                    <img src="/GB.png" alt="United Kingdom" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="login-container">
        <h1>{t('login_title')}</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">{t('email_label')}</label>
            <input
              id="username"
              className="input-field"
              type="text"
              placeholder={t('email_label')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">{t('pass_label')}</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder={t('pass_label')}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
              </button>
            </div>
          </div>

          {errorMessage && <div className="login-error" style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</div>}

          <button id="btn-submit-login" className="btn-login" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Jobbar...' : t('btn_login')}
          </button>
        </form>

        <div className="login-footer">
          <a href="#register">Registrera dig</a>
          <a href="#forgot">Glömt lösenord?</a>
        </div>
      </main>

      <footer className="page-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>123 Fakturera</h2>
          </div>
          <div className="footer-links hide-mobile">
            <a href="#home">Hem</a>
            <a href="#order">Beställ</a>
            <a href="#contact">Kontakta oss</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Lättfaktura, CRO no. 638537, 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
