export interface MenuItem {
  name: string;
  category: string;
  isBestSeller: boolean;
  price: number;
  image: string;
  desc: string;
  stars: boolean[];
  halfStar: boolean;
  reviews: number;
  orderName?: string;
  emptyLast?: boolean;
}

export const menuItems: MenuItem[] = [
  { name: 'Dimsum Original', category: 'Mix', isBestSeller: true, price: 25000, image: '/img/Dimsum.jpeg', desc: 'Kulit lembut dengan isian ayam juicy dan tekstur yang sempurna', stars: [true,true,true,true,false], halfStar: true, reviews: 128 },
  { name: 'Dimsum Mentai', category: 'Mentai', isBestSeller: true, price: 30000, image: '/img/DimsumMentai.jpeg', desc: 'Perpaduan sempurna antara dimsum klasik dengan saus mentai creamy', stars: [true,true,true,true,true], halfStar: false, reviews: 256 },
  { name: 'Dimsum Tartar', category: 'Tartar', isBestSeller: true, price: 30000, image: '/img/dumpling-ayam.jpeg', desc: 'Isian ayam premium dengan saus tartar yang segar dan creamy', stars: [true,true,true,true,false], halfStar: false, reviews: 98 },
  { name: 'Dimsum Cheese Mayo', category: 'Cheese Mayo', isBestSeller: true, price: 30000, image: '/img/dumpling-ikan.jpeg', desc: 'Gurihnya keju dipadu dengan mayo pilihan yang meleleh di mulut', stars: [true,true,true,true,false], halfStar: true, reviews: 187 },
  { name: 'Dimsum Mix Platter', category: 'Mix', isBestSeller: true, price: 55000, image: '/img/Dimsum.jpeg', desc: 'Paket lengkap semua rasa dalam satu piring untuk berbagi bersama', stars: [true,true,true,true,true], halfStar: false, reviews: 312 },
];
