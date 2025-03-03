import Footer from '@/components/LandingPage/Footer';
import Navbar from '@/components/LandingPage/navbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'LuxCars TM',
  description: 'Luxury Cars Toy Car for Sale',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
