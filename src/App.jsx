import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import OurStory from './pages/OurStory';
import Bespoke from './pages/Bespoke';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/bespoke" element={<Bespoke />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
