'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PortfolioData, PortfolioItem } from '@/app/types/portfolio';

export interface SourceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PortfolioGridProps {
  portfolio: PortfolioData;
  onItemClick: (item: PortfolioItem, columnIndex: number, itemIndex: number, sourceRect: SourceRect) => void;
  columnsVisible: boolean[];
  hiddenItemKey?: string | null;
}

export function PortfolioGrid({
  portfolio,
  onItemClick,
  columnsVisible,
  hiddenItemKey = null,
}: PortfolioGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 1048);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className="grid-container">
      <div className="keylines">
        {portfolio.map((column, columnIndex) => (
          <ul
            key={columnIndex}
            className={`column${columnsVisible[columnIndex] ? ' animate-in' : ''}`}
          >
            {column.map((item, itemIndex) => {
              const itemKey = `${columnIndex}-${itemIndex}`;
              const isHidden = hiddenItemKey === itemKey;
              return (
              <li
                key={item.slug}
                className={`item${isHidden ? ' hidden' : ''}`}
                data-column={columnIndex}
                data-index={itemIndex}
                onClick={(e) => {
                  if (!isMobile) {
                    const img = e.currentTarget.querySelector('img');
                    const rect = img?.getBoundingClientRect();
                    if (rect) {
                      onItemClick(item, columnIndex, itemIndex, {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                      });
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (!isMobile && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    const li = e.currentTarget;
                    const img = li.querySelector('img');
                    const rect = img?.getBoundingClientRect();
                    if (rect) {
                      onItemClick(item, columnIndex, itemIndex, {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                      });
                    }
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <img src={item.media.src} alt={item.title} />
                <div className={`cover ${item.media.type}`}>
                  <div className="icon-container" />
                </div>
              </li>
            );
            })}
          </ul>
        ))}
      </div>
      <div className="button-container">
        <a
          className="action-button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://dribbble.com/mikemilla"
          data-type="dribbble"
        >
          See my Dribbble
        </a>
      </div>
    </div>
  );
}
