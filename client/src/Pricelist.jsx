import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Users, Settings, Book, Tag, Layers,
  XCircle, Award, Archive, CreditCard, CloudUpload,
  LogOut, Search, PlusCircle, Printer, ToggleRight,
  MoreHorizontal, ArrowRight, ArrowDown, Menu, Check, AlertCircle
} from 'lucide-react';
import { useLocalization } from './LocalizationContext';
import './Pricelist.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Pricelist({ token, onLogout }) {
  const { t, lang, setLang } = useLocalization();
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) { onLogout(); return; }
        if (!res.ok) throw new Error('fetch failed');
        setItems(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, onLogout]);

  const handleChange = useCallback((id, field, value) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }, []);

  const handleBlur = useCallback(async (id, field, value) => {
    const key = `${id}-${field}`;
    setSaving(prev => ({ ...prev, [key]: 'saving' }));
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ field, value })
      });
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error('save failed');
      setSaving(prev => ({ ...prev, [key]: 'saved' }));
      setTimeout(() => setSaving(prev => { const n = { ...prev }; delete n[key]; return n; }), 1500);
    } catch (e) {
      console.error(e);
      setSaving(prev => ({ ...prev, [key]: 'error' }));
      setTimeout(() => setSaving(prev => { const n = { ...prev }; delete n[key]; return n; }), 3000);
    }
  }, [token, onLogout]);

  const EditCell = ({ id, field, value, align = 'left' }) => {
    const state = saving[`${id}-${field}`];
    return (
      <div className="cell-wrapper">
        <input
          className="pill"
          value={value ?? ''}
          style={{ textAlign: align }}
          onChange={e => handleChange(id, field, e.target.value)}
          onBlur={e => handleBlur(id, field, e.target.value)}
        />
        {state === 'saving' && <span className="cell-status saving">…</span>}
        {state === 'saved'  && <Check size={12} className="cell-status saved" />}
        {state === 'error'  && <AlertCircle size={12} className="cell-status error" />}
      </div>
    );
  };

  return (
    <div className="pricelist-wrapper">

      <header className="dashboard-header">
        <div className="header-left">
          <Menu className="hamburger-icon" size={26} />
          <div className="user-profile desktop-only">
            <div className="avatar">
              <img src="https://ui-avatars.com/api/?name=John+Andre&background=fff&color=0084ff" alt="Avatar" />
            </div>
            <div className="user-info">
              <span className="user-name">John Andre</span>
              <span className="company-name">Storfjord AS</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="header-logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
          
          <div className="flags">
            <div className="lang-selector-trigger" onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}>
              <span className="lang-label">{lang === 'sv' ? 'Svenska' : 'English'}</span>
              <div className="flag-box">
                <img src={lang === 'sv' ? '/SE.png' : '/GB.png'} alt="Selected flag" />
              </div>
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
      </header>

      <aside className="sidebar desktop-only">
        <h2 className="sidebar-title">{t('menu_title')}</h2>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item"><FileText size={18} color="#4cd6e0" />{t('invoices')}</a>
          <a href="#" className="menu-item"><Users size={18} color="#1bb240" />{t('customers')}</a>
          <a href="#" className="menu-item"><Settings size={18} color="#94a3b8" />{t('my_business')}</a>
          <a href="#" className="menu-item"><Book size={18} color="#4c8fe0" />{t('invoice_journal')}</a>
          <a href="#" className="menu-item active">
            <span className="active-dot" />
            <Tag size={18} color="#ff9f43" />{t('price_list')}
          </a>
          <a href="#" className="menu-item"><Layers size={18} color="#4cd6e0" />{t('multiple_invoicing')}</a>
          <a href="#" className="menu-item"><XCircle size={18} color="#ff5252" />{t('unpaid_invoices')}</a>
          <a href="#" className="menu-item"><Award size={18} color="#ffcd3c" />{t('offer')}</a>
          <a href="#" className="menu-item"><Archive size={18} color="#4cd6e0" />{t('inventory_control')}</a>
          <a href="#" className="menu-item"><CreditCard size={18} color="#4c8fe0" />{t('member_invoicing')}</a>
          <a href="#" className="menu-item"><CloudUpload size={18} color="#4c8fe0" />{t('import_export')}</a>
          <a href="#" className="menu-item" onClick={onLogout}><LogOut size={18} color="#4cd6e0" />{t('logout')}</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="toolbar">
          <div className="search-group">
            <div className="search-row">
              <input className="search-input" type="text" placeholder={t('search_article')} />
              <Search size={16} color="#4cd6e0" className="search-icon" />
            </div>
            <div className="search-row">
              <input className="search-input" type="text" placeholder={t('search_product')} />
              <Search size={16} color="#4cd6e0" className="search-icon" />
            </div>
          </div>

          <div className="action-desktop desktop-only">
            <button className="btn-label"><span>{t('new_product')}</span><PlusCircle size={16} color="#1bb240" /></button>
            <button className="btn-label"><span>{t('print_list')}</span><Printer size={16} color="#4c8fe0" /></button>
            <button className="btn-label"><span>{t('advanced_mode')}</span><ToggleRight size={18} color="#4c8fe0" /></button>
          </div>

          <div className="action-tablet-landscape">
            <button className="btn-pill"><PlusCircle size={22} color="#1bb240" /></button>
            <button className="btn-pill"><Printer size={22} color="#4c8fe0" /></button>
            <button className="btn-pill"><ToggleRight size={22} color="#4c8fe0" /></button>
          </div>
        </div>

        <div className="action-portrait">
          <button className="btn-pill-wide"><PlusCircle size={22} color="#1bb240" /></button>
          <button className="btn-pill-wide"><Printer size={22} color="#4c8fe0" /></button>
          <button className="btn-pill-wide"><ToggleRight size={22} color="#4c8fe0" /></button>
        </div>

        {loading && <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Loading...</p>}

        {!loading && (
          <div className="table-scroll">
            <table className="data-table">
              <thead className="thead-full">
                <tr>
                  <th className="col-arrow-td"></th>
                  <th className="col-article-td portrait-hide">
                    {t('article_no')} <ArrowDown size={12} color="#4cd6e0" style={{ verticalAlign: 'middle' }} />
                  </th>
                  <th className="col-product-td">
                    {t('product_service')} <ArrowDown size={12} color="#4cd6e0" style={{ verticalAlign: 'middle' }} />
                  </th>
                  <th className="col-price-td desktop-only text-right">{t('in_price')}</th>
                  <th className="col-price-td text-right">{t('price')}</th>
                  <th className="col-stock-td portrait-hide text-right">{t('in_stock')}</th>
                  <th className="col-unit-td portrait-hide">{t('unit')}</th>
                  <th className="col-product-td desktop-only">{t('description')}</th>
                  <th className="col-dots-td"></th>
                </tr>
              </thead>

              <thead className="thead-minimal">
                <tr>
                  <th className="col-arrow-td"></th>
                  <th className="col-product-td">{t('product_service')}</th>
                  <th className="col-price-td text-right">{t('price')}</th>
                  <th className="col-dots-td"></th>
                </tr>
              </thead>

              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="col-arrow-td">
                      <ArrowRight size={18} color="#4c8fe0" />
                    </td>
                    <td className="col-article-td portrait-hide">
                      <EditCell id={it.id} field="article_no" value={it.article_no} align="center" />
                    </td>
                    <td className="col-product-td">
                      <EditCell id={it.id} field="description" value={it.description} />
                    </td>
                    <td className="col-price-td desktop-only">
                      <EditCell id={it.id} field="in_price" value={it.in_price} align="right" />
                    </td>
                    <td className="col-price-td">
                      <EditCell id={it.id} field="out_price" value={it.out_price} align="right" />
                    </td>
                    <td className="col-stock-td portrait-hide">
                      <EditCell id={it.id} field="stock" value={it.stock} align="right" />
                    </td>
                    <td className="col-unit-td portrait-hide">
                      <EditCell id={it.id} field="unit" value={it.unit} align="center" />
                    </td>
                    <td className="col-product-td desktop-only">
                      <EditCell id={it.id} field="description" value={it.description} />
                    </td>
                    <td className="col-dots-td">
                      <MoreHorizontal size={20} color="#4c8fe0" style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Pricelist;
