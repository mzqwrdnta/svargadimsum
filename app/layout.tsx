import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://svargadimsum.com"),
  title: {
    default: "Svarga Dimsum | Dimsum Mentai & Ayam Premium di Depok",
    template: "%s | Svarga Dimsum",
  },
  description:
    "Svarga Dimsum menyediakan dimsum mentai, ayam, dan keju premium dengan harga terjangkau. Lokasi di Cilodong, Depok dan sekitarnya. Halal & Lezat!",
  keywords: [
    "dimsum cilodong",
    "dimsum depok",
    "svarga dimsum",
    "dimsum mentai",
    "dimsum premium",
    "dimsum halal depok",
    "svarga foodies",
    "kuliner depok",
    "dimsum enak",
    "dimsum frozen",
  ],
  authors: [{ name: "Svarga Dimsum" }],
  creator: "Svarga Dimsum",
  publisher: "Svarga Dimsum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "8p15wd6yl-CjizAp0im8nx2ft2bxEXz3gK_yYl7IcPo",
  },
  openGraph: {
    title: "Svarga Dimsum | Dimsum Mentai & Ayam Premium",
    description:
      "Nikmati kelezatan Svarga Dimsum. Dimsum Mentai, Ayam, dan Keju terbaik di Depok. Pesan sekarang!",
    url: "https://svargadimsum.com",
    siteName: "Svarga Dimsum",
    images: [
      {
        url: "/img/DimsumMentai.jpeg",
        width: 1200,
        height: 630,
        alt: "Svarga Dimsum Mentai",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Svarga Dimsum",
  "url": "https://svargadimsum.com",
  "logo": "https://svargadimsum.com/favicon.svg",
  "description": "Svarga Dimsum menyediakan dimsum mentai, ayam, dan keju premium dengan harga terjangkau di Depok.",
  "sameAs": [
    "https://www.instagram.com/svargadimsum",
    "https://wa.me/6282123149872"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-821-2314-9872",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": "Indonesian"
  }
};

import Preloader from '@/components/Preloader';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import PromoPopup from '@/components/PromoPopup';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Titan+One&family=Baloo+2:wght@700&family=Cabin:wght@500&family=Nunito:wght@400;600&family=Poppins:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lato:wght@400;700&family=Playfair+Display:wght@600;700&family=Quicksand:wght@500;600&family=Urbanist:wght@500&display=swap"
          rel="stylesheet"
        />
        
        <Preloader />
        <Header />
        <main>{children}</main>
        <CartSidebar />
        <PromoPopup />
        <Footer />
        
        <Script
          src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

