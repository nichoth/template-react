import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.tsx'
import { Api } from './api.ts'
import '@substrate-system/css-normalize'
import '@substrate-system/a11y/reduced-motion'
import './main.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App api={Api} />
    </StrictMode>,
)
