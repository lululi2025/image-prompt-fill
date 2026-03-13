import React, { useState, useEffect } from 'react';

/**
 * 行動端专用：当影片模板没有 imageUrl 时，用影片第一帧作为預覽图。
 * 仅在 DiscoveryView 手機端瀑布流中使用，不影响桌面端。
 */
export const MobileVideoFirstFrame = React.memo(({ videoUrl, alt, className = '' }) => {
  const [posterDataUrl, setPosterDataUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!videoUrl || typeof document === 'undefined') return;

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const onLoadedData = () => {
      // 取 0.1 秒处作为首帧（避免全黑）
      video.currentTime = 0.1;
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setFailed(true);
          return;
        }
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPosterDataUrl(dataUrl);
      } catch (e) {
        setFailed(true);
      }
    };

    const onError = () => setFailed(true);

    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);

    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };
  }, [videoUrl]);

  // 成功截到首帧：显示圖片
  if (posterDataUrl) {
    return (
      <img
        src={posterDataUrl}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // 載入中或失败：显示占位（保持 4:3 比例，避免佈局跳动）
  return (
    <div className={`w-full bg-gray-200/50 flex items-center justify-center ${className}`} style={{ aspectRatio: '4/3', minHeight: 80 }}>
      {failed ? (
        <span className="text-[10px] text-gray-400">預覽不可用</span>
      ) : (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-400 rounded-full animate-spin" />
      )}
    </div>
  );
});
MobileVideoFirstFrame.displayName = 'MobileVideoFirstFrame';
