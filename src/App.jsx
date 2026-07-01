import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import OurStory from './pages/OurStory';
import Bespoke from './pages/Bespoke';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Seller Portal
import SellerLayout from './pages/seller/SellerLayout';
import Dashboard from './pages/seller/Dashboard';
import Products from './pages/seller/Products';
import Orders from './pages/seller/Orders';
import Login from './pages/seller/Login';
import Account from './pages/customer/Account';
import Terms from './pages/customer/Terms';
import Privacy from './pages/customer/Privacy';
import Cart from './pages/customer/Cart';
import Wishlist from './pages/customer/Wishlist';
import OurArtisans from './pages/OurArtisans';
import Sustainability from './pages/Sustainability';
import Press from './pages/Press';
import Shipping from './pages/customer/Shipping';
import Returns from './pages/customer/Returns';
import SizeGuide from './pages/customer/SizeGuide';
import FAQ from './pages/customer/FAQ';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Facing Store Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/category/:id" element={
          <>
            <Navbar />
            <main>
              <Category />
            </main>
            <Footer />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <main>
              <ProductDetail />
            </main>
            <Footer />
          </>
        } />
        <Route path="/our-story" element={
          <>
            <Navbar />
            <main>
              <OurStory />
            </main>
            <Footer />
          </>
        } />
        <Route path="/bespoke" element={
          <>
            <Navbar />
            <main>
              <Bespoke />
            </main>
            <Footer />
          </>
        } />
        <Route path="/account" element={
          <>
            <Navbar />
            <main>
              <Account />
            </main>
            <Footer />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Navbar />
            <main>
              <Terms />
            </main>
            <Footer />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Navbar />
            <main>
              <Privacy />
            </main>
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <main>
              <Cart />
            </main>
            <Footer />
          </>
        } />
        <Route path="/wishlist" element={
          <>
            <Navbar />
            <main>
              <Wishlist />
            </main>
            <Footer />
          </>
        } />
        <Route path="/our-artisans" element={
          <>
            <Navbar />
            <main>
              <OurArtisans />
            </main>
            <Footer />
          </>
        } />
        <Route path="/sustainability" element={
          <>
            <Navbar />
            <main>
              <Sustainability />
            </main>
            <Footer />
          </>
        } />
        <Route path="/press" element={
          <>
            <Navbar />
            <main>
              <Press />
            </main>
            <Footer />
          </>
        } />
        <Route path="/shipping" element={
          <>
            <Navbar />
            <main>
              <Shipping />
            </main>
            <Footer />
          </>
        } />
        <Route path="/returns" element={
          <>
            <Navbar />
            <main>
              <Returns />
            </main>
            <Footer />
          </>
        } />
        <Route path="/size-guide" element={
          <>
            <Navbar />
            <main>
              <SizeGuide />
            </main>
            <Footer />
          </>
        } />
        <Route path="/faq" element={
          <>
            <Navbar />
            <main>
              <FAQ />
            </main>
            <Footer />
          </>
        } />

        {/* Seller Portal Routes */}
        <Route path="/seller/login" element={<Login />} />
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
