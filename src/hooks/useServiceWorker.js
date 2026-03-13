import { useEffect, useState, useCallback } from 'react';

/**
 * Service Worker 管理 Hook
 * 提供注册、更新和缓存管理功能
 */
export const useServiceWorker = () => {
  const [registration, setRegistration] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [cachedImageCount, setCachedImageCount] = useState(null);

  // 注册 Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // 检查是否在生产环境或开发环境都启用（根据需要调整）
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((reg) => {
          console.log('[SW] 注册成功:', reg.scope);
          setRegistration(reg);

          // 检查更新
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] 發現新版本');
                setUpdateAvailable(true);
              }
            });
          });
        })
        .catch((error) => {
          console.error('[SW] 注册失败:', error);
        });

      // 监听在线状态
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      console.warn('[SW] 当前浏览器不支持 Service Worker');
    }
  }, []);

  // 应用更新
  const applyUpdate = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.waiting.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [registration]);

  // 清理圖片缓存
  const clearImageCache = useCallback(() => {
    if (registration && registration.active) {
      registration.active.postMessage({ type: 'CLEAR_IMAGE_CACHE' });
      setCachedImageCount(0);
      console.log('[SW] 圖片缓存已清理');
    }
  }, [registration]);

  // 获取缓存圖片数量
  const getCachedImageCount = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('prompt-fill-img-cache-v1');
        const keys = await cache.keys();
        const imageKeys = keys.filter(request => {
          const url = new URL(request.url);
          return /\.(jpg|jpeg|png|gif|webp|svg|ico)(\?.*)?$/i.test(url.pathname) ||
                 url.href.includes('freepik') ||
                 url.href.includes('unsplash') ||
                 url.href.includes('pixabay') ||
                 url.href.includes('imgur');
        });
        setCachedImageCount(imageKeys.length);
        return imageKeys.length;
      } catch (error) {
        console.error('[SW] 获取缓存数量失败:', error);
        return 0;
      }
    }
    return 0;
  }, []);

  return {
    isSupported: 'serviceWorker' in navigator,
    isOnline,
    isReady: !!registration,
    updateAvailable,
    applyUpdate,
    clearImageCache,
    getCachedImageCount,
    cachedImageCount,
  };
};
