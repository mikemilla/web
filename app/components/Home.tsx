'use client';

import { useCallback, useEffect, useState } from 'react';
import portfolioData from '@/app/data/portfolio.json';
import type { PortfolioData, PortfolioItem } from '@/app/types/portfolio';
import type { SourceRect } from './PortfolioGrid';
import { Loading } from './Loading';
import { Header } from './Header';
import { Footer } from './Footer';
import { PortfolioGrid } from './PortfolioGrid';
import { DetailModal } from './DetailModal';

const portfolio = portfolioData as PortfolioData;

const COLUMN_COUNT = 3;
const STAGGER_MS = 60;

export function Home() {
  const [showContent, setShowContent] = useState(false);
  const [headerShown, setHeaderShown] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState<boolean[]>(
    Array(COLUMN_COUNT).fill(false)
  );
  const [detailItem, setDetailItem] = useState<PortfolioItem | null>(null);
  const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);
  const [hiddenItemKey, setHiddenItemKey] = useState<string | null>(null);
  const [scrollLocked, setScrollLocked] = useState(true);

  const showContentView = useCallback(() => {
    setShowContent(true);
    const logo = document.querySelector('.loading .logo') as HTMLElement;
    if (logo) {
      logo.style.marginTop = '100%';
    }
    const duration = 240;
    const unlockAfter = duration + 50;
    setTimeout(() => {
      setScrollLocked(false);
      setHeaderShown(true);
      document.body.style.marginTop = '0';
      document.body.style.background = '#108FFF';
      const header = document.querySelector('header');
      header?.classList.add('shown');
      const titles = document.querySelector('header .titles');
      const image = document.querySelector('header .image');
      if (titles instanceof HTMLElement) titles.style.opacity = '1';
      if (image instanceof HTMLElement) image.style.opacity = '1';
    }, duration);

    setTimeout(() => {
      setColumnsVisible((prev) => prev.map((_, i) => true));
    }, unlockAfter + 300);
  }, []);

  useEffect(() => {
    const profileImg = new window.Image();
    profileImg.src = '/assets/images/profile_1.png';
    profileImg.onload = () => {
      showContentView();
    };
    profileImg.onerror = () => {
      showContentView();
    };
  }, [showContentView]);

  useEffect(() => {
    if (scrollLocked) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [scrollLocked]);

  const handleItemClick = useCallback((item: PortfolioItem, columnIndex: number, itemIndex: number, rect: SourceRect) => {
    setDetailItem(item);
    setSourceRect(rect);
    setHiddenItemKey(`${columnIndex}-${itemIndex}`);
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailItem(null);
    setSourceRect(null);
    setHiddenItemKey(null);
    window.history.replaceState({}, '', '/');
    document.documentElement.style.overflow = '';
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (detailItem) handleCloseDetail();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [detailItem, handleCloseDetail]);

  return (
    <>
      {showContent ? null : <Loading />}
      <div style={{ marginTop: showContent ? 0 : '100vh' }}>
        <Header />
        <PortfolioGrid
          portfolio={portfolio}
          onItemClick={handleItemClick}
          columnsVisible={columnsVisible}
          hiddenItemKey={hiddenItemKey}
        />
        <Footer />
      </div>
      <DetailModal item={detailItem} sourceRect={sourceRect} onClose={handleCloseDetail} />
    </>
  );
}
