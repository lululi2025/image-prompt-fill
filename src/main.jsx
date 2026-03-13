import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 首頁：原来的 App 组件 */}
        <Route path="/" element={<App />} />

        {/* 設定页面：由 App 组件内部处理 */}
        <Route path="/setting" element={<App />} />

        {/* 其他路由未来可以在这里添加 */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* 404 页面：暫時重定向到首頁 */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

