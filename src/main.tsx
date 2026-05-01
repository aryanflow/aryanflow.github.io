import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

/**
 * StrictMode is disabled: @usertive/react-fluid-animation uses legacy WebGL init;
 * double-mount in dev tears down GL context and often breaks the sim or blanks the canvas.
 */
createRoot(document.getElementById('root')!).render(<App />)
