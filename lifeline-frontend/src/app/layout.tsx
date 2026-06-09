import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lifeline — Autonomous Crisis Response Network',
  description: 'Real-time disaster logistics coordination',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}