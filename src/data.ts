import { Product } from './types';

export const SHOP_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Muhammad Asif',
    rating: 5,
    comment: 'Zaffar Bhai produces the finest Gents suit varieties in Manga Mandi. The Egyptian Cotton Latha is absolute premium quality.',
    date: 'May 12, 2026'
  },
  {
    id: 'rev-2',
    name: 'Sobia Imran',
    rating: 5,
    comment: 'The Digital Print Lawn is gorgeous! The 3-piece varieties are highly durable, soft colors, and did not color-bleed at all.',
    date: 'April 28, 2026'
  },
  {
    id: 'rev-3',
    name: 'Rana Naveed',
    rating: 4.8,
    comment: 'Very reasonable rates and top drawer fabrics on Raiwind Road. Perfect destination for family Eid shopping.',
    date: 'May 02, 2026'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Areej Luxury Digital Lawn (3-Piece)',
    description: 'A masterpiece premium summer lawn curated for aesthetic daily wear. Features highly detailed digital prints on a breathable, air-cooled fabric designed specifically for Lahore summers.',
    price: 3650,
    originalPrice: 4200,
    category: 'ladies-3pc',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Bestseller',
    colors: ['Emerald Green', 'Royal Blue', 'Crimson Red', 'Peachy Mustard'],
    inStock: true,
    fabricInfo: {
      material: 'Superfine Airjet Lawn & Pure Chiffon Dupatta',
      pieces: '3-Piece',
      measurement: 'Kameez: 2.75m, Trouser: 2.5m, Dupatta: 2.5m',
      stitchType: 'Unstitched',
      season: 'Summer collection'
    },
    reviews: [
      { id: '1', name: 'Ayesha Bibi', rating: 5, comment: 'Beautiful soft summer lawn fabric. Chiffon Dupatta size is full and elegant!', date: 'May 10, 2026' },
      { id: '2', name: 'Kiran Khan', rating: 4.5, comment: 'Nice vibrant colors, fast delivery recommendation.', date: 'May 18, 2026' }
    ]
  },
  {
    id: 'p-2',
    name: 'Chikankari Luxury Lawn Embroidered (3-Piece)',
    description: 'Exquisite hand-guided visual look embroidery. Front features an intricate Chikankari pattern on pure cambric cotton with embroidered net dupatta borders and extra sleeve patches.',
    price: 4950,
    originalPrice: 5800,
    category: 'ladies-3pc',
    images: [
      'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Exclusive',
    colors: ['Snow White', 'Soft Lavender', 'Pale Mint', 'Peach Gold'],
    inStock: true,
    fabricInfo: {
      material: 'Premium Cambric Cotton & Organza Trim Border',
      pieces: '3-Piece',
      measurement: 'Embroidered Kameez: 3m, Dyed Cambric Trouser: 2.5m, Organza Dupatta: 2.5m',
      stitchType: 'Unstitched',
      season: 'Mid-Summer / Festive'
    },
    reviews: [
      { id: '3', name: 'Zahra Rashid', rating: 5, comment: 'Stitched this for an engagement party. Absolutely gorgeous threads.', date: 'May 14, 2026' }
    ]
  },
  {
    id: 'p-3',
    name: 'Gul Ahmed Signature Jacquard (3-Piece)',
    description: 'Gilded elegant traditional weave that gives a semi-formal royal look. Crafted with high quality interwoven gold threads that stand out at family gatherings and weddings.',
    price: 4450,
    category: 'ladies-3pc',
    images: [
      'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Popular',
    colors: ['Royal Blue Gold', 'Maroon Red Gold', 'Charcoal Black Gold'],
    inStock: true,
    fabricInfo: {
      material: 'Intricate Cotton Jacquard & Thread Weave',
      pieces: '3-Piece',
      measurement: 'Jacquard Kameez: 2.75m, Trouser: 2.5m, Jacquard Dupatta: 2.5m',
      stitchType: 'Unstitched',
      season: 'Autumn / Eid Festive'
    }
  },
  {
    id: 'p-4',
    name: 'Mehnaaz Co-ord Printed Floral (2-Piece)',
    description: 'The trendiest design of the season: matching Kameez & Shalwar (Co-ord sets). High quality digital floral stamps with absolute comfort of fine lawn fabric.',
    price: 2450,
    originalPrice: 2950,
    category: 'ladies-2pc',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'New Co-Ord',
    colors: ['Amber Mustard', 'Deep Turquoise', 'Olive Green', 'Classic Cream'],
    inStock: true,
    fabricInfo: {
      material: 'Premium Dailywear Lawn',
      pieces: '2-Piece (Shirt + Trouser)',
      measurement: 'Kameez (Printed/Digital): 2.5m, Trouser (Matching Print): 2.5m',
      stitchType: 'Unstitched',
      season: 'Summer Daily'
    },
    reviews: [
      { id: '4', name: 'Nida Jamil', rating: 4.8, comment: 'Simple, neat, perfect for university wear. Color did not shed.', date: 'May 05, 2026' }
    ]
  },
  {
    id: 'p-5',
    name: 'Traditional Jaipur Block Print (2-Piece)',
    description: 'Handcrafted looking vintage block print with natural dyes. Very breathable texture, designed for utmost ease in daily home chores and casual market runs.',
    price: 2200,
    originalPrice: 2600,
    category: 'ladies-2pc',
    images: [
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Classic',
    colors: ['Terracotta Indigo', 'Mustard Olive', 'Crimson Black'],
    inStock: true,
    fabricInfo: {
      material: 'Organic Fine Cambric Cotton',
      pieces: '2-Piece (Shirt + Dupatta)',
      measurement: 'Block Print Kameez: 2.5m, Matching Cotton Dupatta: 2.5m',
      stitchType: 'Unstitched',
      season: 'Summer / Monsoon'
    }
  },
  {
    id: 'p-6',
    name: 'Zaffar Iqbal Signature Latha (Gents)',
    description: 'The crowning glory of Al Hamd Fabrics collection. Curated directly by owner Zaffar Iqbal, this premium crispy Cotton Latha is unstitched, starch-friendly, and offers that ultimate pure white traditional elegant feel.',
    price: 3950,
    originalPrice: 4800,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Owner\'s Choice',
    colors: ['Pure Bright White', 'Traditional Off-White', 'Muted Cream'],
    inStock: true,
    fabricInfo: {
      material: '100% Long-Staple Egyptian Cotton',
      pieces: 'Unstitched Gents Suit (4.5 Metres)',
      measurement: 'Length: 4.5 Metres, Custom Width (Bara Arz / Large Width)',
      stitchType: 'Unstitched',
      season: 'All-Season Traditional'
    },
    reviews: [
      { id: '5', name: 'Zain-ul-Abideen', rating: 5, comment: 'Latha quality is outstanding. Gives a solid stiff shine after starching.', date: 'May 11, 2026' },
      { id: '6', name: 'Haji Shakoor', rating: 5, comment: 'Best cloth in Lahore Manga mandi. Worth every rupee.', date: 'May 16, 2026' }
    ]
  },
  {
    id: 'p-7',
    name: 'Al Hamd Premium Soft Boski Silk (Gents)',
    description: 'An premium weighted 8-pound feel spun silk cloth mimicking pure imported Boski. Unbelievably soft, smooth fall (shining drop) that keeps cool in extreme heat and drapes beautifully for elegant occasions.',
    price: 4850,
    originalPrice: 5500,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Luxury',
    colors: ['Classic Soft Yellow Boski', 'Off-White Ivory', 'Elegant Sand'],
    inStock: true,
    fabricInfo: {
      material: 'Spun Silk & Viscose Premium Blend',
      pieces: 'Unstitched Gents Suit (4.5 Metres)',
      measurement: 'Length: 4.5 Metres, Standard Width',
      stitchType: 'Unstitched',
      season: 'Summer / Festive Wear'
    }
  },
  {
    id: 'p-8',
    name: 'Royal Airjet Wash & Wear (Gents)',
    description: 'The supreme wrinkle-resistant fabric for daily executive use. Wash it, dry it, wear it – no extensive ironing required. Made with high quality airjet loom weaves to ensure durability and high sheen.',
    price: 2850,
    originalPrice: 3500,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Best Seller',
    colors: ['Steel Grey', 'Navy Blue', 'Slate Olive', 'Classic Charcoal', 'Jet Black'],
    inStock: true,
    fabricInfo: {
      material: 'Special Microfiber Polyester & Airjet Loom Thread',
      pieces: 'Unstitched Gents Suit (4 Metres)',
      measurement: 'Length: 4.0 Metres, Wide Width (Bara Arz)',
      stitchType: 'Unstitched',
      season: 'All-Year Comfort'
    }
  },
  {
    id: 'p-9',
    name: 'Manga Mandi Supreme Karandi (Wedding Fancy)',
    description: 'A heavily self-textured luxury Karandi suit for special autumn/winter festive wear. Crafted with natural looking uneven silk and cotton slubs that give it an artisanal heritage appeal.',
    price: 5200,
    originalPrice: 6500,
    category: 'wedding-fancy',
    images: [
      'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Premium Festive',
    colors: ['Gilded Khaki', 'Teal Blue', 'Oxblood Maroon', 'Ivory Cream'],
    inStock: true,
    fabricInfo: {
      material: 'Textured Cotton Silk Karandi',
      pieces: '3-Piece (Shirt + Trouser + Karandi Dupatta)',
      measurement: 'Front Embroidered Shirt: 2.75m, Dyed Karandi Trouser: 2.5m, Full Weave Dupatta: 2.5m',
      stitchType: 'Unstitched',
      season: 'Autumn / Winter / Festive'
    }
  },
  {
    id: 'p-10',
    name: 'Al Hamd Imperial Unstitched Linen (Gents)',
    description: 'Highly comfortable and breathable unstitched linen fabric for autumn and early spring. Heavy thread weave with robust structure giving a clean silhouette.',
    price: 3100,
    originalPrice: 3800,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'New Linen',
    colors: ['Cocoa Brown', 'Coffee Bean', 'Mustard Olive', 'Desert Sand'],
    inStock: true,
    fabricInfo: {
      material: '100% Organic Linen Thread Weave',
      pieces: 'Unstitched Gents Suit (4 Metres)',
      measurement: 'Length: 4.0 Metres, Double Width (Bara Arz)',
      stitchType: 'Unstitched',
      season: 'Autumn / Spring Comfort'
    }
  },
  {
    id: 'p-11',
    name: 'Traditional Heavy Weight Winter Khaddar (Gents)',
    description: 'Authentic pure Kamalia style heavy-weight unstitched Khaddar for cold Punjabi nights. Spun using premium manual yarn methods that hold heat beautifully and get softer with every single wash.',
    price: 3250,
    originalPrice: 3950,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Winter Warmth',
    colors: ['Spun Ginger', 'Royal Indigo Navy', 'Smoky Grey', 'Traditional Black'],
    inStock: true,
    fabricInfo: {
      material: '100% Pure Kamalia Khaddar Cotton Blend',
      pieces: 'Unstitched Gents Suit (7 Metres)',
      measurement: 'Length: 7.0 Metres, Single Width (Chota Arz)',
      stitchType: 'Unstitched',
      season: 'Severe Winter Season'
    }
  },
  {
    id: 'p-12',
    name: 'Al Hamd Royal Viscose Soft-Drape (Gents)',
    description: 'Premium soft fall viscose blend unstitched suiting designed for special family gatherings. Has a glossy luxurious surface sheen with smooth drop-down presentation that drapes beautifully without easily wrinkling.',
    price: 4500,
    originalPrice: 5200,
    category: 'gents',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
    ],
    tag: 'Exquisite Fall',
    colors: ['Ivory Silk', 'Graphite Blue', 'Teal Bronze', 'Ebony Black'],
    inStock: true,
    fabricInfo: {
      material: '80% Viscose & 20% Polyester Luxury Yarn',
      pieces: 'Unstitched Gents Suit (4.5 Metres)',
      measurement: 'Length: 4.5 Metres, Standard Width',
      stitchType: 'Unstitched',
      season: 'Spring / Festive Occasion'
    }
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Collection', count: PRODUCTS.length },
  { id: 'ladies-3pc', name: 'Ladies 3-Piece', count: PRODUCTS.filter(p => p.category === 'ladies-3pc').length },
  { id: 'ladies-2pc', name: 'Ladies 2-Piece', count: PRODUCTS.filter(p => p.category === 'ladies-2pc').length },
  { id: 'gents', name: 'Gents Collection', count: PRODUCTS.filter(p => p.category === 'gents').length },
  { id: 'wedding-fancy', name: 'Wedding & Fancy', count: PRODUCTS.filter(p => p.category === 'wedding-fancy').length }
];
