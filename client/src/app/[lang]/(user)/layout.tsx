import { Metadata } from 'next';
import '../../globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CookieBanner from '@/components/cookie-banner';
import banner from '~/public/assets/images/banner.svg';
import Image from 'next/image';

export default function UserLayout({
  auth,
  children,
  params,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gray-800 fixed top-0 w-full z-50">
          <Navbar params={{ lang: params.lang }} />
        </div>

        <main className="flex-grow mt-[65px]">
          <div>{auth}</div>
          <div>{children}</div>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}
