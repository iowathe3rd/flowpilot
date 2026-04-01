import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'FlowPilot Docs',
  description: 'Documentation for FlowPilot headless tour engine',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
