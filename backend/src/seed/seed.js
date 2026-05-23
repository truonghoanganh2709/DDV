import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';
import Banner from '../models/Banner.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

function img(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Promotion.deleteMany({}),
    Banner.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({})
  ]);

  const hashed = await bcrypt.hash('123456', 10);

  const baseUsers = await User.insertMany([
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashed,
      role: 'admin',
      status: 'active',
      phone: '0900000000',
      address: 'TP.HCM'
    },
    {
      name: 'User',
      email: 'user@gmail.com',
      password: hashed,
      role: 'user',
      status: 'active',
      phone: '0911111111',
      address: 'TP.HCM'
    }
  ]);

  // thêm user mẫu để đủ reviews/orders
  const extraUsers = await User.insertMany(
    Array.from({ length: 8 }).map((_, i) => ({
      name: `Khach ${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      password: hashed,
      role: 'user',
      status: 'active',
      phone: `09${String(20000000 + i).padStart(8, '0')}`,
      address: 'TP.HCM'
    }))
  );

  const adminUser = baseUsers[0];
  const normalUser = baseUsers[1];
  const allUsers = [adminUser, normalUser, ...extraUsers];

  const categories = await Category.insertMany([
    { id: 'dien-thoai', name: 'Dien thoai', slug: 'dien-thoai', icon: 'Smartphone', active: true },
    { id: 'tablet', name: 'Tablet', slug: 'tablet', icon: 'Tablet', active: true },
    { id: 'mac', name: 'Mac', slug: 'mac', icon: 'Laptop', active: true },
    { id: 'may-cu', name: 'May cu gia re', slug: 'may-cu', icon: 'Recycle', active: true },
    { id: 'phu-kien', name: 'Phu kien', slug: 'phu-kien', icon: 'Headphones', active: true },
    { id: 'dong-ho', name: 'Dong ho', slug: 'dong-ho', icon: 'Watch', active: true }
  ]);

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme'];
  const catIds = categories.map((c) => c.id);

  const products = await Product.insertMany(
    Array.from({ length: 24 }).map((_, i) => {
      const num = String(i + 1).padStart(3, '0');
      const id = `p${num}`;
      const brand = randomFrom(brands);
      const category = randomFrom(catIds);
      const price = 3000000 + i * 450000;
      const oldPrice = price + 800000;

      return {
        id,
        name: `${brand} Phone ${i + 1}`,
        brand,
        category,
        price,
        oldPrice,
        originalPrice: oldPrice,
        image: img(id),
        images: [img(`${id}-1`), img(`${id}-2`), img(`${id}-3`)],
        stock: 20 + (i % 30),
        description: `Mo ta san pham ${id}. Hang chinh hang, bao hanh 12 thang.`,
        specs: {
          RAM: i % 2 === 0 ? '8GB' : '12GB',
          'Bo nho': i % 3 === 0 ? '128GB' : '256GB',
          Chip: i % 2 === 0 ? 'Snapdragon' : 'Apple A-series',
          Man_hinh: '6.7 inch'
        },
        rating: 4.2,
        reviewCount: 0,
        sold: 10 + i * 3,
        status: 'active',
        featured: i % 5 === 0,
        flashSale: i % 7 === 0,
        installment: true,
        promos: ['Giam them 200K khi thanh toan online', 'Tra gop 0%'],
        colors: ['Den', 'Trang', 'Xanh'].slice(0, (i % 3) + 1)
      };
    })
  );

  const promotions = await Promotion.insertMany([
    {
      id: 'promo-1',
      code: 'DDV10',
      name: 'Giam 10% don hang',
      discountType: 'percent',
      discountValue: 10,
      minOrderValue: 5000000,
      maxDiscount: 2000000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true
    },
    {
      id: 'promo-2',
      code: 'DDV50K',
      name: 'Giam 50.000d',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 3000000,
      maxDiscount: 50000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true
    },
    {
      id: 'promo-3',
      code: 'HSSV',
      name: 'Sinh vien giam 5%',
      discountType: 'percent',
      discountValue: 5,
      minOrderValue: 0,
      maxDiscount: 500000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-06-30'),
      isActive: true
    },
    {
      id: 'promo-4',
      code: 'IPHONE300',
      name: 'iPhone giam 300K',
      discountType: 'fixed',
      discountValue: 300000,
      minOrderValue: 10000000,
      maxDiscount: 300000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-08-31'),
      isActive: true
    },
    {
      id: 'promo-5',
      code: 'FREESHIP',
      name: 'Mien phi van chuyen',
      discountType: 'fixed',
      discountValue: 30000,
      minOrderValue: 2000000,
      maxDiscount: 30000,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: false
    }
  ]);

  await Banner.insertMany([
    {
      id: 'banner-1',
      title: 'KHACH HANG MOI DOC QUYEN',
      subtitle: 'Uu dai len den 2 trieu',
      image: '',
      link: '/products',
      cta: 'LIEN HE MUA NGAY',
      bg: 'linear-gradient(135deg, #ff6b35, #d71920)',
      active: true,
      order: 1
    },
    {
      id: 'banner-2',
      title: 'GALAXY S25 ULTRA',
      subtitle: 'Tang Galaxy Buds + Tra gop 0%',
      image: '',
      link: '/products/p005',
      cta: 'MUA NGAY',
      bg: 'linear-gradient(135deg, #1a1a2e, #4a4ae8)',
      active: true,
      order: 2
    },
    {
      id: 'banner-3',
      title: 'IPHONE SERIES',
      subtitle: 'Chinh hang VN/A',
      image: '',
      link: '/products?brand=Apple',
      cta: 'XEM NGAY',
      bg: 'linear-gradient(135deg, #ff9a9e, #d71920)',
      active: true,
      order: 3
    },
    {
      id: 'banner-4',
      title: 'THU CU DOI MOI',
      subtitle: 'Len doi iPhone moi',
      image: '',
      link: '/products?category=may-cu',
      bg: 'linear-gradient(135deg, #f7971e, #ffd200)',
      active: true,
      order: 4
    },
    {
      id: 'banner-5',
      title: 'PHU KIEN APPLE',
      subtitle: 'AirPods, Watch giam soc',
      image: '',
      link: '/products?category=phu-kien',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      active: false,
      order: 5
    }
  ]);

  // Orders (10)
  const ordersPayload = Array.from({ length: 10 }).map((_, i) => {
    const buyer = i % 2 === 0 ? normalUser : randomFrom(extraUsers);
    const picked = [products[i % products.length], products[(i + 3) % products.length]];
    const items = picked.map((p, idx) => ({
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity: idx === 0 ? 1 : 2,
      image: p.image
    }));
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const promo = i % 3 === 0 ? promotions[0] : null;
    const discountAmount = promo ? Math.min(Math.round(subtotal * (promo.discountValue / 100)), promo.maxDiscount) : 0;
    const totalPrice = subtotal - discountAmount;
    const orderCode = `ORD${String(10001 + i)}`;

    return {
      orderCode,
      user: buyer._id,
      customerInfo: {
        gender: i % 2 === 0 ? 'Anh' : 'Chi',
        name: buyer.name,
        phone: buyer.phone || '0900000000',
        email: buyer.email,
        address: '123 Nguyen Hue',
        city: 'TP.HCM',
        district: 'Quan 1',
        delivery: 'home'
      },
      items,
      subtotal,
      discountAmount,
      promoCode: promo?.code || null,
      shippingFee: 0,
      totalPrice,
      paymentMethod: i % 2 === 0 ? 'cod' : 'vnpay',
      status: i % 4 === 0 ? 'completed' : 'pending',
      note: ''
    };
  });

  await Order.insertMany(ordersPayload);

  // Reviews (20) - 1 user/1 product unique
  const comments = [
    'San pham tot, giao hang nhanh.',
    'Hang chinh hang, bao hanh day du.',
    'Gia hop ly, tu van nhiet tinh.',
    'Pin tot, man hinh dep.',
    'Dung rat muot, recommend.',
    'Dong goi can than, se mua tiep.'
  ];

  const reviewDocs = [];
  const used = new Set(); // `${userId}-${productId}`
  let rid = 1;
  while (reviewDocs.length < 20) {
    const u = randomFrom(allUsers);
    const p = randomFrom(products);
    const key = `${u._id}-${p._id}`;
    if (used.has(key)) continue;
    used.add(key);

    reviewDocs.push({
      id: `rev-${rid++}`,
      user: u._id,
      product: p._id,
      userId: String(u._id),
      userName: u.name || u.email,
      productId: p.id,
      rating: 3 + (reviewDocs.length % 3),
      comment: comments[reviewDocs.length % comments.length],
      status: reviewDocs.length % 5 === 0 ? 'hidden' : 'visible'
    });
  }

  await Review.insertMany(reviewDocs);

  // cập nhật rating/reviewCount theo visible reviews
  for (const p of products) {
    const visible = reviewDocs.filter((r) => r.productId === p.id && r.status === 'visible');
    const count = visible.length;
    const avg = count ? visible.reduce((s, r) => s + r.rating, 0) / count : 0;
    await Product.updateOne(
      { _id: p._id },
      { $set: { reviewCount: count, rating: Math.round(avg * 10) / 10 } }
    );
  }

  console.log('Seed xong!');
  console.log('Admin: admin@gmail.com / 123456');
  console.log('User: user@gmail.com / 123456');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
