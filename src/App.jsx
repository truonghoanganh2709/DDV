import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import StoreLocator from './pages/StoreLocator';
import OrderTracking from './pages/OrderTracking';
import Promotions from './pages/Promotions';
import Dashboard from './admin/pages/Dashboard';
import ProductListAdmin from './admin/pages/ProductListAdmin';
import ProductFormAdmin from './admin/pages/ProductFormAdmin';
import CategoryAdmin from './admin/pages/CategoryAdmin';
import OrderListAdmin from './admin/pages/OrderListAdmin';
import OrderDetailAdmin from './admin/pages/OrderDetailAdmin';
import UserListAdmin from './admin/pages/UserListAdmin';
import PromotionAdmin from './admin/pages/PromotionAdmin';
import BannerAdmin from './admin/pages/BannerAdmin';
import ReviewAdmin from './admin/pages/ReviewAdmin';
import SettingsAdmin from './admin/pages/SettingsAdmin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="stores" element={<StoreLocator />} />
        <Route path="track-order" element={<OrderTracking />} />
        <Route path="promotions" element={<Promotions />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductListAdmin />} />
        <Route path="products/add" element={<ProductFormAdmin />} />
        <Route path="products/edit/:id" element={<ProductFormAdmin />} />
        <Route path="categories" element={<CategoryAdmin />} />
        <Route path="orders" element={<OrderListAdmin />} />
        <Route path="orders/:id" element={<OrderDetailAdmin />} />
        <Route path="users" element={<UserListAdmin />} />
        <Route path="promotions" element={<PromotionAdmin />} />
        <Route path="banners" element={<BannerAdmin />} />
        <Route path="reviews" element={<ReviewAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
