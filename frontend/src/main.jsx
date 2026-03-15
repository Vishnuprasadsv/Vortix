import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'
import App from './App'
import './index.css'

// Suppress specific harmless console errors for a cleaner developer console
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) return;
  if (typeof args[0] === 'string' && /width\(-1\)/.test(args[0]) && /height\(-1\)/.test(args[0])) return;
  originalConsoleError(...args);
};

// Render the main React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux store provider to share state across components */}
    <Provider store={store}>
      {/* React Router for handling page navigation */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
