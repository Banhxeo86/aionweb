import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AI-ON',
  description: '미래 교육을 선도하는 AI-ON입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 250px)' }}>
          {children}
        </main>
        <footer>
          <div className="container">
            <div className="footer-content">
              &copy; 2026 AI-ON 교과연구회. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
