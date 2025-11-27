// src/app/layout.js
import './globals.css';
import { ThemeProvider } from './ThemeContext';

export const metadata = {
  title: 'SkyCalm - Calming Dashboard',
  description: 'A calming app for nervous fliers. Breathe, relax, and fly with confidence.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#14b8a6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#14b8a6" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="bg-gradient-to-br from-teal-50 via-pink-50 to-yellow-50 min-h-screen font-sans antialiased transition-colors duration-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <ThemeProvider>
            {/* Skip link for accessibility */}
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <div id="main-content">
            {children}
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}