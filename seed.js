const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('Error: DATABASE_URL not set');
  console.error('Usage: DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app node seed.js');
  process.exit(1);
}

const products = {
  "sindhri": {
    name: "Sindhri Mango",
    slug: "sindhri",
    price: 800,
    salePrice: 650,
    description: "Known as the 'Honey Mango', Sindhri is Pakistan's most beloved variety. Sweet, aromatic, and incredibly juicy with smooth, fiberless flesh.",
    category: "sindhri",
    images: [
      {
        original: "https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/honey-mango.jpg",
        webp: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp/mangostore/mangostore/honey-mango.jpg",
        thumbnail: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,w_200/mangostore/mangostore/honey-mango.jpg"
      }
    ],
    stock: 500,
    weightKg: 1,
    deliveryCities: ["karachi", "malir", "hyderabad"],
    tags: ["sindhri", "sweet", "honey", "popular"],
    isFeatured: true,
    isActive: true,
    seoTitle: "Sindhri Mango - Honey Mango of Pakistan",
    seoDescription: "Fresh Sindhri mangoes delivered from Multan orchards",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "chaunsa": {
    name: "Chaunsa Mango",
    slug: "chaunsa",
    price: 1200,
    salePrice: 950,
    description: "The 'King of Mangoes'. Chaunsa is rich, creamy, and intensely sweet with a unique aromatic flavor. Late-season variety available in July-August.",
    category: "chaunsa",
    images: [
      {
        original: "https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/hero.jpg",
        webp: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp/mangostore/mangostore/hero.jpg",
        thumbnail: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,w_200/mangostore/mangostore/hero.jpg"
      }
    ],
    stock: 300,
    weightKg: 1,
    deliveryCities: ["karachi", "malir", "lahore"],
    tags: ["chaunsa", "premium", "king", "sweet"],
    isFeatured: true,
    isActive: true,
    seoTitle: "Chaunsa Mango - King of Mangoes",
    seoDescription: "Premium Chaunsa mangoes from Multan orchards",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "anwar-ratol": {
    name: "Anwar Ratol Mango",
    slug: "anwar-ratol",
    price: 1000,
    salePrice: 850,
    description: "Small but incredibly sweet. Anwar Ratol is the connoisseur's choice — intensely flavored with a rich, syrupy taste and smooth texture.",
    category: "anwar-ratol",
    images: [
      {
        original: "https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/premium_mango_box.jpg",
        webp: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp/mangostore/mangostore/premium_mango_box.jpg",
        thumbnail: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,w_200/mangostore/mangostore/premium_mango_box.jpg"
      }
    ],
    stock: 200,
    weightKg: 1,
    deliveryCities: ["karachi", "malir"],
    tags: ["anwar-ratol", "sweet", "premium", "small"],
    isFeatured: true,
    isActive: true,
    seoTitle: "Anwar Ratol Mango - Extra Sweet Variety",
    seoDescription: "Premium Anwar Ratol mangoes, small but incredibly sweet",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "langra": {
    name: "Langra Mango",
    slug: "langra",
    price: 900,
    salePrice: 750,
    description: "A classic North Indian and Pakistani variety. Langra has a distinctive green skin even when ripe, with a tangy-sweet flavor and firm flesh.",
    category: "langra",
    images: [
      {
        original: "https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/mango-box.jpg",
        webp: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp/mangostore/mangostore/mango-box.jpg",
        thumbnail: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,w_200/mangostore/mangostore/mango-box.jpg"
      }
    ],
    stock: 150,
    weightKg: 1,
    deliveryCities: ["karachi", "malir"],
    tags: ["langra", "tangy", "classic"],
    isFeatured: false,
    isActive: true,
    seoTitle: "Langra Mango - Classic Tangy Sweet Variety",
    seoDescription: "Fresh Langra mangoes with distinctive tangy-sweet flavor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "dusehri": {
    name: "Dusehri Mango",
    slug: "dusehri",
    price: 850,
    salePrice: 700,
    description: "One of the oldest and most aromatic varieties. Dusehri has a unique fragrance, smooth fiberless pulp, and a perfectly balanced sweet taste.",
    category: "dusehri",
    images: [
      {
        original: "https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/farm_harvest.jpg",
        webp: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,mangostore/mangostore/farm_harvest.jpg",
        thumbnail: "https://res.cloudinary.com/dzimmsjyx/image/upload/f_webp,w_200/mangostore/mangostore/farm_harvest.jpg"
      }
    ],
    stock: 250,
    weightKg: 1,
    deliveryCities: ["karachi", "malir"],
    tags: ["dusehri", "aromatic", "classic", "fiberless"],
    isFeatured: true,
    isActive: true,
    seoTitle: "Dusehri Mango - Aromatic Classic Variety",
    seoDescription: "Fresh Dusehri mangoes with smooth fiberless pulp",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

async function seed() {
  console.log('Seeding products to:', DB_URL);
  
  for (const [id, product] of Object.entries(products)) {
    const res = await fetch(`${DB_URL}/products/${id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    
    if (res.ok) {
      console.log(`✓ Seeded: ${product.name}`);
    } else {
      console.error(`✗ Failed: ${product.name} (${res.status})`);
    }
  }
  
  console.log('\nDone! Refresh your website to see the products.');
}

seed();
