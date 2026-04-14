import React, { createContext, useState, useEffect, useContext } from 'react';

const LocalizationContext = createContext();

export const useLocalization = () => useContext(LocalizationContext);

const API = import.meta.env.VITE_API_URL || '';

export const LocalizationProvider = ({ children }) => {
  const [lang, setLang] = useState('sv');
  const [strings, setStrings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/localization/${lang}`)
      .then(res => res.json())
      .then(data => setStrings(data))
      .catch(err => console.error('Localization fetch error:', err));
  }, [lang]);

  const t = (key) => strings[key] || key;

  return (
    <LocalizationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};
