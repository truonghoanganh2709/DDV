# Di Động Việt Shop (Clone)

Website thương mại điện tử bán điện thoại — React + Vite, giao diện tham chiếu [didongviet.vn](https://didongviet.vn).

## Chạy dự án

```bash
cd didongviet-shop
npm install
npm run dev
```

Mở URL hiển thị trong terminal (thường `http://localhost:5173`).

## Tài khoản demo

| Email | Mật khẩu |
|-------|----------|
| `demo@didongviet.vn` | `123456` |

## Mã giảm giá (giỏ hàng)

- `DDV10` — Giảm 10%
- `DDV50K` — Giảm 50.000đ
- `HSSV` — Giảm 5%

## Cấu trúc thư mục

```
src/
├── components/
│   ├── common/      # ProductCard, Breadcrumb, ProtectedRoute, FloatingActions
│   ├── home/        # HeroSection, QuickLinks, ProductSection
│   └── layout/      # Header, Footer, SearchBar, Layout
├── constants/       # routes, theme
├── context/         # AuthContext, CartContext, WishlistContext
├── data/            # products (24+), categories, stores
├── hooks/           # useTypewriterPlaceholder
├── pages/           # Home, Products, Cart, Checkout, Auth, ...
├── styles/          # global.css
└── utils/           # formatPrice, filterProducts
```

## Routes

| Path | Trang |
|------|--------|
| `/` | Trang chủ |
| `/products` | Danh sách + lọc/sắp xếp |
| `/products/:id` | Chi tiết sản phẩm |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/order-success` | Đặt hàng thành công |
| `/login`, `/register`, `/forgot-password` | Tài khoản |
| `/profile`, `/orders` | Bảo vệ (đăng nhập) |
| `/wishlist` | Yêu thích |
| `/stores` | Cửa hàng gần bạn |
| `/track-order` | Tra cứu đơn |
| `/promotions` | Khuyến mãi |

## Tech stack

React 18 · Vite 5 · React Router 6 · Context API · lucide-react · CSS Modules
