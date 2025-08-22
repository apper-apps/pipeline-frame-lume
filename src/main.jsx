import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

// Initialize the application
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render the app
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)