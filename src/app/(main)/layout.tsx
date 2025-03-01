import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
