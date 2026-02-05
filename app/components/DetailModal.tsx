'use client';

import { useEffect, useRef, useState } from 'react';
import type { PortfolioItem as PortfolioItemType } from '@/app/types/portfolio';
import type { SourceRect } from './PortfolioGrid';

interface DetailModalProps {
  item: PortfolioItemType | null;
  sourceRect: SourceRect | null;
  onClose: () => void;
}

const MAX_WIDTH = 500;

function getDestRect(source: SourceRect) {
  if (typeof window === 'undefined') return { ...source };
  const vh = window.innerHeight;
  const targetHeight = vh * 0.9;
  const mediaAreaWidth = window.innerWidth * 0.66;
  const maxW = Math.min(mediaAreaWidth, MAX_WIDTH);
  const scaleByHeight = targetHeight / source.height;
  let destWidth = source.width * scaleByHeight;
  let destHeight = targetHeight;
  if (destWidth > maxW) {
    destWidth = maxW;
    destHeight = source.height * (maxW / source.width);
  }
  return {
    width: destWidth,
    height: destHeight,
    left: (mediaAreaWidth - destWidth) / 2,
    top: (vh - destHeight) / 2,
  };
}

export function DetailModal({ item, sourceRect, onClose }: DetailModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const sharedElementRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'initial' | 'expanded' | 'exiting'>('initial');
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [rect, setRect] = useState<SourceRect | ReturnType<typeof getDestRect>>({ left: 0, top: 0, width: 0, height: 0 });

  const displayRect = phase === 'initial' ? sourceRect : rect;

  // Open: start at sourceRect (from props), then animate to destination
  useEffect(() => {
    if (!item || !sourceRect) return;
    setPhase('initial');
    setDescriptionVisible(false);

    const handlePopState = () => {
      setDescriptionVisible(false);
      setPhase('exiting');
      setRect(sourceRect);
    };
    window.history.pushState({}, '', `/${item.slug}`);
    window.addEventListener('popstate', handlePopState);

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRect(getDestRect(sourceRect));
        setPhase('expanded');
        setDescriptionVisible(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [item, sourceRect, onClose]);

  // When expanded, show description/background; handle video play
  useEffect(() => {
    if (!item || phase !== 'expanded') return;
    if (item.media.type === 'video') {
      const video = videoRef.current;
      if (video) {
        const onPlaying = () => loadingRef.current?.classList.add('dismiss');
        video.addEventListener('playing', onPlaying);
        const t = setTimeout(() => video.play(), 100);
        return () => {
          clearTimeout(t);
          video.pause();
          video.removeEventListener('playing', onPlaying);
        };
      }
    }
  }, [item, phase]);

  // Exiting: listen for transitionend then call onClose (once, after animation finishes)
  useEffect(() => {
    if (phase !== 'exiting') return;
    const el = sharedElementRef.current;
    if (!el) return;
    let done = false;
    const onEnd = () => {
      if (done) return;
      done = true;
      onClose();
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [phase, onClose]);

  const handleCloseClick = () => {
    if (!sourceRect || phase === 'exiting') return;
    setDescriptionVisible(false);
    setPhase('exiting');
    setRect(sourceRect);
  };

  if (!item || !sourceRect) return null;

  const isVideo = item.media.type === 'video';

  return (
    <div className="detailed-view">
      <div
        className={`background ${descriptionVisible && phase !== 'exiting' ? 'visible' : ''}`}
        onClick={handleCloseClick}
        aria-hidden
      />
      <button
        type="button"
        className={`close-button ${phase === 'exiting' ? 'exit' : 'enter'}`}
        onClick={handleCloseClick}
        aria-label="Close"
      />
      <div className={`description ${descriptionVisible && phase !== 'exiting' ? 'visible' : ''}`}>
        <div className="content">
          {item.title && <h1>{item.title}</h1>}
          {item.role && <h2>{item.role}</h2>}
          {item.description && (
            <>
              <div className="break" />
              <p
                dangerouslySetInnerHTML={{
                  __html: item.description.replace(/<br\s*\/?>/gi, '<br />'),
                }}
              />
            </>
          )}
          {item.url && item.action && (
            <a
              className="action-button"
              target="_blank"
              rel="noopener noreferrer"
              href={item.url}
              data-type="send-message"
            >
              {item.action}
            </a>
          )}
        </div>
      </div>
      <div
        ref={sharedElementRef}
        className="shared-element"
        style={{
          left: displayRect.left,
          top: displayRect.top,
          width: displayRect.width,
          height: displayRect.height,
        }}
      >
        {isVideo ? (
          <>
            <div className="loading-indicator" ref={loadingRef}>
              <div className="indicator-container" />
            </div>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={item.media.src}
            >
              <source src={item.media.extra} />
            </video>
          </>
        ) : (
          <img src={item.media.src} alt={item.title} />
        )}
      </div>
    </div>
  );
}
