import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './ds/tokens/primitives.css';
import './ds/tokens/semantic.css';
import './ds/tokens/layout.css';
import './ds/tokens/base.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
