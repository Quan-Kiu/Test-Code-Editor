import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameApp } from './app/GameApp';
import './styles/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Application root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <GameApp />
  </StrictMode>,
);
