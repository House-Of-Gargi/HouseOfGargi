import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PageTransitionProvider } from '@/context/PageTransitionContext';

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <PageTransitionProvider>
        <main>{children}</main>
      </PageTransitionProvider>
      <Footer />
    </>
  );
}
