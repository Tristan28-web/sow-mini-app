import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './SOW.jsx'
import './Global.css'
import { LocalizationProvider } from './LocalizationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </React.StrictMode>,
)
