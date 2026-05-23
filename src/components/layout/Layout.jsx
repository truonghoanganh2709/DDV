import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActions from '../common/FloatingActions';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
