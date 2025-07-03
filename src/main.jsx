import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InventoryDashboard from './bao_cao_ton.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InventoryDashboard/>
  </StrictMode>,
)
