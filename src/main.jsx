import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import InventoryDashboard from './bao_cao_ton.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InventoryDashboard />
  </StrictMode>,
)
