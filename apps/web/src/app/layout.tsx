import type { Metadata } from 'next';
import { Inter, Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navigation from '../components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const vazir = Vazirmatn({ 
  subsets: ['arabic'],
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  title: 'ChatGPT Clone',
  description: 'AI-powered chat application with multi-language support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${vazir.variable} font-sans antialiased`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
