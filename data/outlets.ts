export interface Outlet {
  slug: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapUrl: string;
  image: string;
  description: string;
}

export const outlets: Outlet[] = [
  {
    slug: 'depok',
    name: 'Svarga Dimsum Depok (Pusat)',
    address: 'Jl. Raya Abdul Gani No.2 Blok B, Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413',
    hours: 'Setiap Hari: 10.00 - 21.00 WIB',
    phone: '+62 821-2314-9872',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.593881200354!2d106.833801474117!3d-6.446157363031236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eb007ad89db7%3A0x6e22c675cd8ffd98!2sSvarga%20Foodies!5e0!3m2!1sid!2sid!4v1750420769937!5m2!1sid!2sid',
    image: '/img/outlet1.jpeg',
    description: 'Cabang utama Svarga Dimsum yang menyediakan pengalaman dine-in terbaik dengan desain interior yang estetik dan area parkir yang luas.'
  },
  {
    slug: 'bogor',
    name: 'Svarga Dimsum Bogor (Express)',
    address: 'Jl. Pajajaran No.15, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153',
    hours: 'Setiap Hari: 09.00 - 22.00 WIB',
    phone: '+62 812-3456-7890',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.389771120286!2d106.80554161477045!3d-6.598404995227847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5c2d3a0100d%3A0x5e23d5b74b12c5!2sBotani%20Square%20Mall%20Bogor!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid',
    image: '/img/DimsumMentai.jpeg',
    description: 'Konsep outlet express yang berfokus pada layanan takeaway dan delivery dengan kecepatan pelayanan maksimal untuk warga Bogor.'
  }
];
