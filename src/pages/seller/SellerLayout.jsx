import { Outlet, Link, useLocation } from 'react-router-dom';

export default function SellerLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/seller' },
    { name: 'Products', path: '/seller/products' },
    { name: 'Orders', path: '/seller/orders' },
  ];

  return (
    <div className="seller-layout">
      <aside className="seller-sidebar">
        <div className="seller-sidebar__header">
          <h2>Gargi Seller</h2>
        </div>
        <nav className="seller-sidebar__nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`seller-sidebar__link ${location.pathname === item.path ? 'is-active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="seller-sidebar__footer">
          <Link to="/" className="btn btn--outline" style={{ width: '100%', textAlign: 'center', borderColor: 'var(--soft-gold-line)', color: 'var(--ivory-silk)' }}>
            Back to Store
          </Link>
        </div>
      </aside>
      
      <main className="seller-content">
        <header className="seller-content__header">
          <div className="seller-content__breadcrumb">
            House of Gargi / <span>Seller Portal</span>
          </div>
        </header>
        <div className="seller-content__body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
