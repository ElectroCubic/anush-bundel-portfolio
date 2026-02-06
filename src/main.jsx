import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const UIcolor = getComputedStyle(document.documentElement)
    .getPropertyValue('--card-bg-color').trim();

document.querySelector('meta[name="theme-color"]').setAttribute('content', UIcolor);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
