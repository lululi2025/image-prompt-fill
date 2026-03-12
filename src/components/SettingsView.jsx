import React, { useState } from 'react';
import {
  Globe, Database, Download, Upload,
  Trash2, Mail, MessageCircle, Github,
  ChevronRight, RefreshCw, FolderOpen, X, Heart,
  Cloud
} from 'lucide-react';
import { openExternalLink } from '../utils/platform';

export const SettingsView = ({ 
  language, setLanguage, 
  storageMode, setStorageMode,
  directoryHandle,
  handleImportTemplate, handleExportAllTemplates,
  handleResetSystemData, handleClearAllData,
  handleSelectDirectory, handleSwitchToLocalStorage,
  SYSTEM_DATA_VERSION, t,
  globalContainerStyle,
  isDarkMode,
  themeMode,
  setThemeMode,
  iCloudEnabled,
  setICloudEnabled,
  lastICloudSyncAt,
  lastICloudSyncError
}) => {
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [storageStats, setStorageStats] = React.useState(null);

  const isTauriMobile = !!(window.__TAURI_INTERNALS__ && /iPhone|iPad|iPod/i.test(navigator.userAgent));
  const iCloudStatusLabel = () => {
    if (lastICloudSyncError) return language === 'cn' ? '同步失敗' : 'Failed';
    if (!iCloudEnabled) return language === 'cn' ? '已關閉' : 'OFF';
    if (!lastICloudSyncAt) return language === 'cn' ? '等待同步' : 'Pending';
    const time = new Date(lastICloudSyncAt).toLocaleString();
    return language === 'cn' ? `上次同步: ${time}` : `Last sync: ${time}`;
  };
  const iCloudDescription = lastICloudSyncError
    ? (language === 'cn' ? `同步失敗：${lastICloudSyncError}` : `Sync failed: ${lastICloudSyncError}`)
    : (language === 'cn' ? '在多台 iOS 裝置間同步資料' : 'Sync data across iOS devices');

  React.useEffect(() => {
    if (storageMode === 'browser' && navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        setStorageStats({
          usage: estimate.usage,
          quota: estimate.quota,
          percent: Math.round((estimate.usage / estimate.quota) * 100) || 0
        });
      });
    }
  }, [storageMode]);
  
  const updateLogs = language === 'cn' ? [
    {
      version: 'V0.9.2',
      date: '2026年2月10日',
      time: '10:00 AM',
      title: '素材系統功能升級',
      type: 'UPDATE',
      content: [
        '支援素材使用模板素材：提升了素材引用的靈活性。'
      ]
    },
    {
      version: 'V0.9.1',
      date: '2026年2月8日',
      time: '08:30 PM',
      title: '手機端體驗深度最佳化',
      type: 'UPDATE',
      content: [
        '最佳化手機端互動體驗：提升了小螢幕下的操作便利性。',
        '最佳化模板編輯版面：重新調整了編輯面板的寬度分配與對齊方式。'
      ]
    },
    {
      version: 'V0.9.0',
      date: '2026年2月8日',
      time: '07:00 PM',
      title: '影片模板深度支援與行動端體驗最佳化',
      type: 'MAJOR',
      content: [
        '影片模板深度支援：新增影片預覽、封面管理及參考素材多源上傳功能。',
        '行動端編輯重構：採用「上二下一」新版面，文字區域寬度提升至 60%，預覽支援橫向滑動。',
        '互動最佳化：手機端編輯或滑動正文時，資訊區域支援自動折疊，釋放更多創作空間。',
        '視覺微調：最佳化了上傳控件尺寸與標籤顯示邏輯，介面更加清爽緊湊。'
      ]
    },
    {
      version: 'V0.8.2',
      date: '2026年1月31日',
      time: '11:50 PM',
      title: '行動端 UI 深度最佳化與鳴謝更新',
      type: 'MAJOR',
      content: [
        '首頁重構：引入漸進式毛玻璃頂部欄與無捲軸橫向標籤導覽。',
        '版面重組：詳情頁整合模板與詞庫抽屜開關至頂欄，最佳化螢幕使用率。',
        '複製增強：複製提示詞結果時，自動附帶推薦的出圖平台資訊。',
        '視覺微調：移除設定介面圖示底色，提升整體視覺通透感。',
        '鳴謝更新：完整補充了所有提示詞靈感貢獻作者。'
      ]
    },
    {
      version: 'Data V0.8.7',
      date: '2026年1月24日',
      time: '01:02 AM',
      title: '提示詞作者資訊更正',
      type: 'UPDATE',
      content: [
        '資料更正：修正了部分精選模板的作者標注資訊。'
      ]
    },
    {
      version: 'V0.8.1',
      date: '2026年1月22日',
      time: '10:13 PM',
      title: '自訂詞條雙語支援',
      type: 'UPDATE',
      content: [
        '自訂詞條雙語支援：現在可以在新增或修改自訂選項時，分別輸入中文和英文內容。'
      ]
    },
    {
      version: 'V0.8.0',
      date: '2026年1月17日',
      time: '10:00 AM',
      title: '智慧詞條正式上線與多項功能增強',
      type: 'MAJOR',
      content: [
        '智慧詞條正式版：AI 驅動的提示詞自動生成與詞庫擴充功能正式上線。',
        '官方模板擴充：新增紫禁城雪夜、高端食品廣告、中式新娘肖像等多款精美藝術模板。',
        '🚀 效能與體驗最佳化：最佳化了瀑布流載入效能與行動端互動細節，提升系統整體穩定性。'
      ]
    },
    {
      version: 'V0.7.2',
      date: '2026年1月13日',
      time: '11:00 AM',
      title: '系統架構最佳化與資料版本更新',
      type: 'MAJOR',
      content: [
        '🚀 系統升級：全站同步升級至 V0.7.2，最佳化核心互動效能與系統運行效率。',
        '📊 資料更新：資料版本升級至 V0.8.4，包含最新的預置詞庫擴充與模板最佳化。',
        '📝 文件同步：全面更新專案 Readme 與發版維護指南，確保「一處修改，全端同步」。'
      ]
    },
    {
      version: 'V0.7.1',
      date: '2026年1月7日',
      time: '10:00 AM',
      title: '儲存架構升級與系統維護',
      type: 'MAJOR',
      content: [
        '💾 儲存架構升級：核心資料（模板、詞庫、分類）遷移至 IndexedDB，徹底解決 LocalStorage 5MB 限制。',
        '🛠️ 系統維護：暫時下線「智慧詞條」功能，最佳化內部儲存穩定性。',
        '🆙 版本號更新：全站同步升級至 V0.7.1，包含元資料最佳化。'
      ]
    },
    {
      version: 'V0.7.0',
      date: '2026年1月3日',
      time: '11:30 AM',
      title: '匯出穩定性與統計功能增強',
      type: 'MAJOR',
      content: [
        '新增 Vercel Analytics 整合，即時掌握應用訪問動態。',
        '匯出功能重大升級：支援短連結動態 QR Code，長連結自動降級至官網 QR Code。',
        '行動端預覽最佳化：圖片預覽全面支援暗色模式，視覺互動更沉浸。',
        '匯出穩定性增強：引入圖片 Base64 預快取與 CORS 智慧代理。',
        'UI 細節最佳化：重構匯出按鈕版面，美化操作文案與互動體驗。'
      ]
    },
    {
      version: 'V0.6.5',
      date: '2025年12月31日',
      time: '10:00 AM',
      title: '資料版本大更新與系統最佳化',
      type: 'MAJOR',
      content: [
        '新增模板連結分享：支援生成公開分享連結，實現模板跨使用者快速流轉。',
        '資料版本升級至 V0.7.6：全面更新預置提示詞庫，新增多項創意模板。',
        '系統架構微調：最佳化資料持久化邏輯，提升海量資料下的讀取速度。',
        '多端同步增強：完善了行動端與桌面端的資料同步校驗機制。',
        'UI 細節微調：修復了暗色模式下部分邊框顯示異常的問題。'
      ]
    },
    {
      version: 'V0.6.1',
      date: '2025年12月26日',
      time: '11:00 AM',
      title: '聯動組邏輯修復與版本升級',
      type: 'UPDATE',
      content: [
        '修復了聯動組匹配過於寬鬆的 Bug，現在僅限相同組號聯動。',
        '全站版本號同步升級至 V0.6.1，包含瀏覽器標題及各處 UI 標識。',
        '最佳化了暗色模式下的部分圖示對比度及 UI 細節。'
      ]
    },
    {
      version: 'V0.6.0',
      date: '2025年12月24日',
      time: '02:00 PM',
      title: '暗夜模式與視覺體驗升級',
      type: 'NEW',
      content: [
        '新增暗夜模式（Dark Mode）：全域深度適配，支援一鍵切換沉浸式黑色主題。',
        'UI 細節最佳化：重構了標籤、圖示及按鈕的視覺回饋，提升高對比度下的舒適度。',
        '效能增強：最佳化了長列表模板過濾邏輯，確保切換不同分類時的極致流暢。'
      ]
    },
    {
      version: 'V0.5.1',
      date: '2025年12月22日',
      time: '10:30 AM',
      title: '行動端互動重構與視覺升級',
      type: 'NEW',
      content: [
        '全新行動端架構：引入側滑抽屜（Drawer）互動，最佳化單手操作體驗。',
        '沉浸式預覽：針對手機端重新設計圖片預覽，支援 3D 陀螺儀視覺回饋與全螢幕手勢操作。',
        '效能飛躍：首頁引入高效能 Mesh Gradient 演算法徹底解決背景閃爍，海報捲動升級至 60FPS。',
        '細節打磨：重寫核心圖示提升高解析度螢幕清晰度，最佳化資料遷移邏輯支援無損升級。'
      ]
    },
    {
      version: 'V0.5.0',
      date: '2025年12月20日',
      time: '04:15 PM',
      title: '發現頁瀑布流與架構重構',
      type: 'MAJOR',
      content: [
        '架構重構：完成巨型應用元件化解耦，大幅提升程式碼維護性與資源調度效率。',
        '新增發現頁：基於 Masonry 版面的瀑布流入口，支援海量精美模板快速瀏覽。',
        '匯出增強：寬度提升至 860px 適配複雜排版，最佳化長圖拼接清晰度。',
        '版本感知：新增模板/應用雙重版本校驗，支援雲端更新即時無損同步。'
      ]
    },
    {
      version: 'V0.4.1',
      date: '2025年12月12日',
      time: '09:00 AM',
      title: '匯出最佳化與互動細節提升',
      type: 'UPDATE',
      content: [
        '儲存最佳化：匯出格式改為 JPG（92% 品質），檔案大小減小 60-70%。',
        '智慧氛圍：引入氛圍色提取演算法，自動根據模板圖片生成高級背景。',
        '互動升級：行動端匯入模板全面採用 Toast 通知替代 alert。',
        '匯出穩定性：徹底解決了匯出時正文內容可能遺漏的問題。'
      ]
    },
    {
      version: 'V0.4.0',
      date: '2025年12月10日',
      time: '11:00 AM',
      title: '模板體驗與持久化增強',
      type: 'UPDATE',
      content: [
        '模板系統：新增瀑布流展示與標籤過濾，支援匯入/匯出（Beta）。',
        '資料安全：預設本地化儲存模板與詞庫，支援重新整理預設並保留使用者資料。',
        '工程最佳化：支援上傳本機圖片或 URL 替換模板預覽圖。'
      ]
    },
    {
      version: 'V0.3.0',
      date: '2025年12月08日',
      time: '02:00 PM',
      title: 'UI 規範化與功能說明完善',
      type: 'UPDATE',
      content: [
        'UI 升級：採用統一的 Premium Button 設計語言，增加懸停漸變動效。',
        '全螢幕預覽：引入 Lightbox 全螢幕圖片預覽模式，支援查看海報細節。',
        '文件完善：重構分步驟使用指南，新增圖像管理與使用技巧說明。'
      ]
    },
    {
      version: 'V0.2.0',
      date: '2025年12月05日',
      time: '10:00 AM',
      title: '匯出功能與響應式適配',
      type: 'UPDATE',
      content: [
        '功能新增：增加模板匯出高清長圖分享功能。',
        '高度自訂：開放自訂分類顏色配置，最佳化視覺清晰度。',
        '版面最佳化：全面最佳化桌面端與行動端的響應式版面適配。'
      ]
    },
    {
      version: 'V0.1.0',
      date: '2024年11月20日',
      time: '09:00 AM',
      title: '初始版本發布',
      type: 'UPDATE',
      content: [
        '核心引擎：實現基於 {{variable}} 語法的結構化 Prompt 引擎。',
        '基礎功能：支援模板建立、詞庫管理及變數填空互動系統。',
        '資料持久化：建立基於 LocalStorage 的本地儲存方案。'
      ]
    }
  ] : [
    { 
      version: 'V0.9.2', 
      date: 'Feb 10, 2026', 
      time: '10:00 AM',
      title: 'Material System Upgrade',
      type: 'UPDATE',
      content: [
        'Supported using template materials in assets: improved flexibility of material referencing.'
      ]
    },
    { 
      version: 'V0.9.1', 
      date: 'Feb 8, 2026', 
      time: '08:30 PM',
      title: 'Mobile UX Deep Optimization',
      type: 'UPDATE',
      content: [
        'Enhanced Mobile Interaction: Improved usability on small screens.',
        'Optimized Editor Layout: Refined width distribution and alignment in the editing panel.'
      ]
    },
    { 
      version: 'V0.9.0', 
      date: 'Feb 8, 2026', 
      time: '07:00 PM',
      title: 'Video Template Support & Mobile UX Upgrade',
      type: 'MAJOR',
      content: [
        'Video Support: Added video previews, cover management, and multi-source asset uploads.',
        'Mobile Refactor: New layout with 60% text width and horizontal scrolling previews.',
        'Smart Interaction: Auto-collapsing info section when editing on mobile.',
        'UI Refinement: Optimized upload control sizes and label visibility for a cleaner look.'
      ]
    },
    { 
      version: 'V0.8.2', 
      date: 'Jan 31, 2026', 
      time: '11:50 PM',
      title: 'Mobile UI Deep Optimization',
      type: 'MAJOR',
      content: [
        'Header Refactor: Progressive blur top bar with horizontal tag navigation.',
        'Layout Redesign: Integrated drawer toggles in editor header for better spacing.',
        'Copy Enhancement: Automatically include recommended platform when copying results.',
        'UI Refinement: Removed icon backgrounds in settings for a cleaner look.',
        'Credits Update: Fully updated the list of prompt inspiration contributors.'
      ]
    },
    { 
      version: 'Data V0.8.7', 
      date: 'Jan 24, 2026', 
      time: '01:02 AM',
      title: 'Author Attribution Fix',
      type: 'UPDATE',
      content: [
        'Data Update: Corrected author information for specific featured templates.'
      ]
    },
    { 
      version: 'V0.8.1', 
      date: 'Jan 22, 2026', 
      time: '10:13 PM',
      title: 'Bilingual Support for Custom Terms',
      type: 'UPDATE',
      content: [
        'Bilingual Support: Separately input CN and EN content when adding or editing custom options.'
      ]
    },
    { 
      version: 'V0.8.0', 
      date: 'Jan 17, 2026', 
      time: '10:00 AM',
      title: 'AI Official Launch & Feature Enhancements',
      type: 'MAJOR',
      content: [
        'AI Terms Official: AI-powered prompt generation and library expansion are now officially live.',
        'Library Expansion: Added new high-quality templates including Forbidden City Snow, Premium Food Ad, and more.',
        'UX & Performance: Optimized masonry layout loading and refined mobile interactions for better stability.'
      ]
    },
    { 
      version: 'V0.7.2', 
      date: 'Jan 13, 2026', 
      time: '11:00 AM',
      title: 'System Optimization & Data Update',
      type: 'MAJOR',
      content: [
        '🚀 System Upgrade: Synchronized to V0.7.2 with core performance optimizations.',
        '📊 Data Update: Data version upgraded to V0.8.4 with new bank expansions and template refinements.',
        '📝 Documentation: Comprehensive updates to README and release checklists for better workflow.'
      ]
    },
    { 
      version: 'V0.7.1', 
      date: 'Jan 7, 2026', 
      time: '10:00 AM',
      title: 'Storage Upgrade & Maintenance',
      type: 'MAJOR',
      content: [
        '💾 Storage Upgrade: Migrated core data (templates, banks) to IndexedDB, overcoming the 5MB LocalStorage limit.',
        '🛠️ Maintenance: Temporarily disabled AI Terms feature and optimized internal storage stability.',
        '🆙 Version Bump: Synchronized to V0.7.1 with metadata optimizations.'
      ]
    },
    { 
      version: 'V0.7.0', 
      date: 'Jan 3, 2026', 
      time: '11:30 AM',
      title: 'Export Stability & Analytics',
      type: 'MAJOR',
      content: [
        'Integrated Vercel Analytics for real-time app usage insights.',
        'Major Export Upgrade: Support for dynamic short-link QR codes.',
        'Mobile Preview Upgrade: Full Dark Mode support for immersive experience.',
        'Export Stability: Added Base64 pre-caching and CORS proxy fallback.',
        'UI Refinement: Improved desktop action buttons and mobile interaction layout.'
      ]
    },
    { 
      version: 'V0.6.5', 
      date: 'Dec 31, 2025', 
      time: '10:00 AM',
      title: 'Data Milestone & System Optimization',
      type: 'MAJOR',
      content: [
        'Template Link Sharing: Support for generating public sharing links for quick template distribution.',
        'Data upgraded to V0.7.6: Comprehensive update to preset banks and new creative templates.',
        'Architecture refinement: Optimized persistence logic for faster data loading.',
        'Cross-device enhancement: Improved data sync validation between mobile and desktop.',
        'UI Fixes: Resolved minor border rendering issues in Dark Mode.'
      ]
    },
    { 
      version: 'V0.6.1', 
      date: 'Dec 26, 2025', 
      time: '11:00 AM',
      title: 'Linkage Group Fix & Version Bump',
      type: 'UPDATE',
      content: [
        'Fixed bug where linkage groups were too loose; now only same groupId syncs.',
        'Synchronized versioning to V0.6.1 across the entire app.',
        'Optimized icon contrast and minor UI details in Dark Mode.'
      ]
    },
    { 
      version: 'V0.6.0', 
      date: 'Dec 24, 2025', 
      time: '02:00 PM',
      title: 'Dark Mode & Visual Upgrade',
      type: 'NEW',
      content: [
        'Added Dark Mode support with system-wide adaptation.',
        'Refined UI components for better clarity and comfort in dark themes.',
        'Improved performance for template list filtering.'
      ]
    },
    { 
      version: 'V0.5.1', 
      date: 'Dec 22, 2025', 
      time: '10:30 AM',
      title: 'Mobile Interaction Refactor',
      type: 'NEW',
      content: [
        'New mobile architecture with drawer interactions.',
        'Immersive preview with gyroscope feedback and full-screen gestures.',
        'Mesh Gradient integration to fix background flickering on low-end devices.',
        'Redrawn core icons for better clarity on high-DPI screens.'
      ]
    },
    { 
      version: 'V0.5.0', 
      date: 'Dec 20, 2025', 
      time: '04:15 PM',
      title: 'Discovery View & Performance',
      type: 'MAJOR',
      content: [
        'Added Discovery View with Masonry layout for better template browsing.',
        'Enhanced export options with custom ratios and improved clarity.',
        'Refactored LocalStorage logic for real-time multi-tab synchronization.',
        'Improved English localizations and fixed UI alignment issues.'
      ]
    },
    { 
      version: 'V0.4.1', 
      date: 'Dec 12, 2025', 
      time: '09:00 AM',
      title: 'Export & UX Improvements',
      type: 'UPDATE',
      content: [
        'Exported JPG format (92% quality), reducing file size by 60-70%.',
        'Automatic atmosphere background extraction from template images.',
        'Mobile import now uses Toast notifications instead of alerts.',
        'Fixed stability issues during long image exports.'
      ]
    },
    { 
      version: 'V0.4.0', 
      date: 'Dec 10, 2025', 
      time: '11:00 AM',
      title: 'Templates & Persistence',
      type: 'UPDATE',
      content: [
        'New Discovery View with masonry layout and tag filtering.',
        'Improved data persistence with system preset merging.',
        'Support for local file and URL image uploads.'
      ]
    },
    { 
      version: 'V0.3.0', 
      date: 'Dec 08, 2025', 
      time: '02:00 PM',
      title: 'UI & Documentation',
      type: 'UPDATE',
      content: [
        'Premium Button design language with hover animations.',
        'Lightbox mode for full-screen image preview.',
        'Complete user guide refactor with step-by-step instructions.'
      ]
    },
    { 
      version: 'V0.2.0', 
      date: 'Dec 05, 2025', 
      time: '10:00 AM',
      title: 'Export & Responsive Design',
      type: 'UPDATE',
      content: [
        'Added high-definition long image export for sharing.',
        'Customizable category colors for better visual organization.',
        'Comprehensive responsive layout optimizations.'
      ]
    },
    { 
      version: 'V0.1.0', 
      date: 'Nov 20, 2024', 
      time: '09:00 AM',
      title: 'Initial Release',
      type: 'UPDATE',
      content: [
        'Structured Prompt engine with {{variable}} syntax.',
        'Template management and variable-based fill-in interaction.',
        'LocalStorage-based data persistence solution.'
      ]
    }
  ];

  const SettingSection = ({ title, children }) => (
    <div className="mb-8">
      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ icon: Icon, label, value, onClick, disabled = false, danger = false, active = false, description = null }) => (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 ${disabled ? 'opacity-30 cursor-not-allowed' : active ? (isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/10') : (isDarkMode ? 'hover:bg-white/5 active:scale-[0.98]' : 'hover:bg-orange-500/5 active:scale-[0.98]')}`}
    >
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className={`flex-shrink-0 transition-colors duration-200 ${danger ? 'text-red-500 group-hover:text-red-600' : active ? 'text-orange-600' : (isDarkMode ? 'text-gray-600 group-hover:text-orange-400' : 'text-gray-500 group-hover:text-orange-500')}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start min-w-0">
          <div className={`text-[12px] font-bold tracking-tight truncate ${danger ? 'text-red-600' : active ? 'text-orange-600' : (isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-800')}`}>
            {label}
          </div>
          {description && (
            <div className={`text-[10px] mt-0.5 opacity-60 truncate max-w-[200px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {description}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {value && <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{value}</span>}
        {!disabled && <ChevronRight size={12} className={`transition-colors ${active ? 'text-orange-300' : 'text-gray-300 group-hover:text-orange-300'}`} />}
      </div>
    </button>
  );

  return (
    <div style={globalContainerStyle} className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header Area - Parallel Titles */}
      <div className="px-10 pt-12 pb-6 flex-shrink-0 flex items-end">
        <div className="w-[35%] pr-10">
          <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'cn' ? '設定' : 'Settings'}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-[9px] font-black tracking-[0.1em] uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              System V0.9.2
            </span>
            <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <span className="text-[9px] font-black text-orange-500/80 tracking-[0.1em] uppercase">
              Data {SYSTEM_DATA_VERSION}
            </span>
          </div>
        </div>
        <div className="flex-1 ml-20">
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
             {language === 'cn' ? '更新日誌' : 'Latest Updates'}
          </h2>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden px-10 pb-10">
        
        {/* Left: Settings Area (35%) */}
        <div className="w-[35%] overflow-y-auto custom-scrollbar pr-10 flex flex-col">
          <div className="flex-1">
            <SettingSection title={language === 'cn' ? '基礎偏好' : 'Preferences'}>
              <SettingItem
                icon={Globe}
                label={language === 'cn' ? '介面語言' : 'Language'}
                value={language === 'cn' ? 'CN' : 'EN'}
                onClick={() => setLanguage(language === 'cn' ? 'en' : 'cn')}
              />
              <div className="flex items-center gap-2 p-2.5">
                <span className={`text-[12px] font-bold tracking-tight shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>
                  {language === 'cn' ? '外觀模式' : 'Appearance'}
                </span>
                <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'} ml-auto scale-[0.85] origin-right`}>
                  {[
                    { id: 'light', label: language === 'cn' ? '亮色' : 'Light' },
                    { id: 'dark', label: language === 'cn' ? '暗色' : 'Dark' },
                    { id: 'system', label: language === 'cn' ? '自動' : 'Auto' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setThemeMode(mode.id)}
                      className={`premium-toggle-item ${isDarkMode ? 'dark' : 'light'} ${themeMode === mode.id ? 'is-active' : ''}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </SettingSection>

            <SettingSection title={language === 'cn' ? '資料儲存' : 'Storage'}>
              <div className="flex flex-col gap-1">
                <SettingItem
                  icon={Database}
                  label={language === 'cn' ? '瀏覽器儲存' : 'Browser'}
                  description={language === 'cn' ? '使用 IndexedDB 模式（無限容量）' : 'IndexedDB Mode (Unlimited)'}
                  active={storageMode === 'browser'}
                  onClick={handleSwitchToLocalStorage}
                />
                {storageMode === 'browser' && storageStats && (
                  <div className="px-3 mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {language === 'cn' ? '儲存空間已用' : 'Storage Used'}
                      </span>
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {(storageStats.usage / 1024 / 1024).toFixed(1)}MB / {(storageStats.quota / 1024 / 1024 / 1024).toFixed(1)}GB
                      </span>
                    </div>
                    <div className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <div 
                        className="h-full bg-orange-500/50 transition-all duration-500" 
                        style={{ width: `${Math.max(1, storageStats.percent)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <SettingItem
                  icon={FolderOpen}
                  label={language === 'cn' ? '本機資料夾' : 'Local Folder'}
                  description={storageMode === 'folder' && directoryHandle ? `路徑: /${directoryHandle.name}` : (language === 'cn' ? '自動儲存到本機資料夾' : 'Auto-save to local folder')}
                  active={storageMode === 'folder'}
                  onClick={handleSelectDirectory}
                />

                {isTauriMobile && (
                  <SettingItem
                    icon={Cloud}
                    label={language === 'cn' ? 'iCloud 同步' : 'iCloud Sync'}
                    description={iCloudDescription}
                    value={iCloudStatusLabel()}
                    active={iCloudEnabled}
                    onClick={() => setICloudEnabled(!iCloudEnabled)}
                  />
                )}
              </div>
            </SettingSection>

            <SettingSection title={language === 'cn' ? '模板管理' : 'Templates'}>
              <div className="relative group">
                <label className="cursor-pointer">
                  <input type="file" accept=".json" onChange={handleImportTemplate} className="hidden" />
                  <div className={`group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-orange-500/5'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Download size={16} className={`transition-colors flex-shrink-0 ${isDarkMode ? 'text-gray-600 group-hover:text-orange-400' : 'text-gray-500 group-hover:text-orange-500'}`} />
                      <span className={`text-[12px] font-bold truncate ${isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-700'}`}>{language === 'cn' ? '匯入 JSON' : 'Import JSON'}</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-orange-300 flex-shrink-0" />
                  </div>
                </label>
              </div>
              <SettingItem
                icon={Upload}
                label={language === 'cn' ? '匯出模板' : 'Export Templates'}
                onClick={handleExportAllTemplates}
              />
              <SettingItem
                icon={RefreshCw}
                label={language === 'cn' ? '重設預設' : 'Reset System'}
                onClick={handleResetSystemData}
              />
              <SettingItem
                icon={Trash2}
                label={language === 'cn' ? '清空資料' : 'Clear All'}
                danger={true}
                onClick={handleClearAllData}
              />
            </SettingSection>

            <SettingSection title={language === 'cn' ? '關於與支援' : 'About'}>
              <SettingItem
                icon={Heart}
                label={language === 'cn' ? '鳴謝' : 'Credits'}
                onClick={() => setShowCredits(true)}
              />
              <SettingItem
                icon={Mail}
                label={language === 'cn' ? '意見回饋信箱' : 'Feedback'}
                onClick={() => window.location.href = 'mailto:tanshilong@gmail.com'}
              />
              <SettingItem
                icon={MessageCircle}
                label={language === 'cn' ? '作者微信' : 'WeChat'}
                onClick={() => setShowWechatQR(true)}
              />
              <SettingItem 
                icon={Github} 
                label="GitHub Open Source" 
                onClick={() => openExternalLink('https://github.com/TanShilongMario/PromptFill')}
              />
            </SettingSection>
          </div>

          {/* Manifesto Text */}
          <div className="mt-8 px-1">
            <p className="text-[12px] font-black text-orange-600 leading-relaxed">
              {language === 'cn' 
                ? 'Prompt Fill 為創作者而生。所有資料均儲存在本地，我們不會上傳您的任何提示詞內容。'
                : 'Built for creators. All data stays local; we never upload your prompts.'}
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className={`w-[1.5px] my-8 ${isDarkMode ? 'bg-white/5' : 'bg-gray-200/80'}`} />

        {/* Right: Update Logs Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar ml-20 pr-4 space-y-12">
          {updateLogs.map((log, idx) => (
            <div key={idx} className="flex gap-8 group">
              {/* Timeline Left */}
              <div className="w-32 flex-shrink-0 pt-1 text-right">
                <div className={`text-[13px] font-black ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`}>{log.date}</div>
                <div className={`text-[10px] font-bold tabular-nums mb-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{log.time}</div>
                <div className="text-[11px] font-black text-orange-500/80 tracking-widest">{log.version}</div>
              </div>

              {/* Timeline Center */}
              <div className="relative flex flex-col items-center">
                <div className={`w-[1.5px] h-full absolute top-4 group-last:hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-orange-500 z-10 shadow-[0_0_8px_rgba(249,115,22,0.2)] ${isDarkMode ? 'bg-[#242120]' : 'bg-white'}`} />
              </div>

              {/* Timeline Right */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{log.title}</h3>
                  {idx === 0 && (
                    <span className="px-1.5 py-0.5 text-[8px] font-black bg-orange-500 text-white rounded uppercase tracking-wider">
                      {language === 'cn' ? '最新' : 'LATEST'}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {log.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                      <p className={`text-[13px] leading-relaxed font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WeChat QR Popover */}
      {showWechatQR && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowWechatQR(false)}
        >
          <div 
            className={`p-8 rounded-[32px] shadow-2xl border relative animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-[#242120] border-white/5 shadow-black/50' : 'bg-white border-white/60'}`}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowWechatQR(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center">
              <div className={`w-48 h-48 rounded-2xl overflow-hidden mb-4 border p-2 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <img 
                  src="/Wechat.jpg" 
                  alt="WeChat QR Code" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className={`text-sm font-black mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'cn' ? '掃碼新增作者微信' : 'Scan to add on WeChat'}</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Connect on WeChat</p>
            </div>
          </div>
        </div>
      )}

      {/* Credits Popover */}
      {showCredits && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowCredits(false)}
        >
          <div 
            className={`p-10 rounded-[40px] shadow-2xl border relative animate-in zoom-in-95 duration-300 max-w-xl ${isDarkMode ? 'bg-[#242120] border-white/5 shadow-black/50' : 'bg-white border-white/60'}`}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowCredits(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                <Heart size={32} className="text-orange-500 fill-orange-500" />
              </div>
              
              <h3 className={`text-2xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'cn' ? '鳴謝與致敬' : 'Credits & Acknowledgments'}
              </h3>
              
              <div className={`space-y-6 text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="font-bold text-orange-600">
                  {language === 'cn' 
                    ? '本專案為開源專案，旨在提升 AI 創作者的工作流效率。'
                    : 'This is an open-source project aimed at improving AI creator workflows.'}
                </p>
                
                <p>
                  {language === 'cn' 
                    ? '特別感謝為提示詞提供靈感的作者：'
                    : 'Special thanks to authors who provided prompt inspirations:'}
                  <br />
                  <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    宝玉(@dotey), MarioTan(@tanshilong), sundyme, Berryxia.AI, sidona, AmirMushich, Latte(@0xbisc), 阿兹特克小羊驼(@AztecaAlpaca), Keng哥(@langzihan), 虎小象(@hx831126), PlayForge AI(@94van.AI), underwood(@underwoodxie96), @YaseenK7212, Taaruk(@Taaruk_), M7(@mi7_crypto), @aleenaamiir, 两斤(@0x00_Krypt), ttmouse-豆爸(@ttmouse), Amira Zairi(@azed_ai), Ege(@egeberkina), Vigo Zhao(@VigoCreativeAI), Michael Rabone(@michaelrabone), Gadgetify(@Gdgtify), YangGuang (@YangGuangAI), Mr.Iancu @Iancu_ai, John @johnAGI168, Umesh @umesh_ai
                  </span>
                </p>
                
                <p>
                  {language === 'cn' 
                    ? '以及在專案初期給予大力支持的'
                    : 'And early support from '}
                  <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>松果先森</span>
                  {language === 'cn' ? '，以及所有提供建議、發現 Bug 及提交 Issue 的夥伴們。' : ', and all contributors who provided suggestions and bug reports.'}
                </p>
                
                <div className={`h-px w-12 mx-auto my-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                
                <p className="italic">
                  {language === 'cn' 
                    ? '最後感謝我的摯愛，我的女神，感謝她能夠忍受我在半夜敲鍵盤的聲音，並給予我一路的陪伴和支持。'
                    : 'Final thanks to my beloved, my goddess, for enduring my late-night typing and for her constant support.'}
                  <Heart size={12} className="inline ml-1 text-red-500 fill-red-500" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
