import './globals.css';
import { Montserrat } from 'next/font/google';
const monsteratt = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-monsteratt',
});

export const metadata = {
  title: 'Yellow Book',
  description: 'Yellow Book',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className={`${monsteratt.variable} font-sans`}>{children}</body>
    </html>
  );
}
