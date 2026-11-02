import { ViteReactSSG } from 'vite-react-ssg/single-page'
import App from './App.jsx'
import './index.css'
import './editorial.css'

export const createRoot = ViteReactSSG(<App />)
