import type {Metadata} from 'next';
import { JetBrains_Mono, Rubik } from 'next/font/google';
import './globals.css'; // Global styles

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Buckshot Tracker',
  description: 'Your little mathematical slave for survival',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${rubik.variable} dark`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="crt-overlay" />
        <div className="vignette" />
        {children}
      </body>
    </html>
  );
}
