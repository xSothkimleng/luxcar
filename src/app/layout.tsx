import './globals.css';
import type { Metadata } from 'next';
import LayoutProvider from '@/components/layout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Anime D Verse',
  description: 'Swag Dashboard',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body>
        <LayoutProvider session={JSON.parse(JSON.stringify(session))}>{children}</LayoutProvider>
      </body>
    </html>
  );
}
