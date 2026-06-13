import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'reactflow/dist/style.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Lifeline — Autonomous Crisis Response Network',
  description: 'Real-time disaster logistics coordination',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}