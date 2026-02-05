import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mike Miller - Product Designer + UX Engineer',
  description: 'I make ideas become reality. I love to design, prototype, and engineer digital experiences.',
};

export const viewport: Viewport = {
  themeColor: '#108FFF',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
