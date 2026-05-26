import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  initAnalytics
} from './services/analyticsService';
import {
  initErrorTracking
} from './services/errorTrackingService';

initAnalytics();
initErrorTracking();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
