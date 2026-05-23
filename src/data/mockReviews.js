const reviews = [];
const products = ['p001', 'p002', 'p003', 'p004', 'p005', 'p008', 'p009', 'p014', 'p018'];
const users = [
  { id: 'user-1', name: 'Nguyen Van User' },
  { id: 'user-2', name: 'Tran Thi B' },
  { id: 'user-3', name: 'Le Van C' },
  { id: 'user-5', name: 'Hoang Van E' },
];
const comments = [
  'San pham tot, giao hang nhanh.',
  'Hang chinh hang, bao hanh day du.',
  'Gia hop ly, tu van nhiet tinh.',
  'Pin tot, man hinh dep.',
  'Dung rat muot, recommend.',
  'Giao hang dung hen, dong goi can than.',
  'Shop uy tin, se mua tiep.',
  'May moi nguyen seal, rat hai long.',
];

let id = 1;
products.forEach((productId) => {
  for (let i = 0; i < 3; i++) {
    const u = users[(id + i) % users.length];
    reviews.push({
      id: `rev-${id}`,
      productId,
      userId: u.id,
      userName: u.name,
      rating: 3 + (id % 3),
      comment: comments[id % comments.length],
      status: id % 7 === 0 ? 'hidden' : 'visible',
      createdAt: new Date(2025, 4, (id % 28) + 1).toISOString(),
    });
    id++;
  }
});

export const SEED_REVIEWS = reviews;
