export interface PortfolioMedia {
  type: 'video' | 'photo' | 'gif' | 'screenshot';
  src: string;
  extra?: string;
}

export interface PortfolioItem {
  slug: string;
  media: PortfolioMedia;
  title: string;
  role: string;
  description: string;
  url?: string;
  action?: string;
}

export type PortfolioData = PortfolioItem[][];
