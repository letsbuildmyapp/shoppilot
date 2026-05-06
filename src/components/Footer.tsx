import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-line bg-bone-100 mt-24">
      <div className="container-edit py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <p className="font-display text-3xl">Kiln Ridge</p>
          <p className="mt-3 text-coal-mute max-w-[40ch]">
            Hand-thrown stoneware and porcelain from a single Vermont studio. Made in small lots; fired one batch at a time.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-forest">All work</Link></li>
            <li><Link to="/shop?category=tableware" className="hover:text-forest">Tableware</Link></li>
            <li><Link to="/shop?category=mugs" className="hover:text-forest">Mugs &amp; cups</Link></li>
            <li><Link to="/shop?category=vases" className="hover:text-forest">Vases</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Studio</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-forest">About the studio</Link></li>
            <li><Link to="/account" className="hover:text-forest">Your account</Link></li>
            <li><Link to="/orders" className="hover:text-forest">Order history</Link></li>
            <li>
              <a href="https://letsbuildmyapp.com" className="hover:text-forest" target="_blank" rel="noreferrer">
                Built by letsbuildmyapp.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-edit border-t border-line py-6 text-xs text-coal-mute flex items-center justify-between">
        <span>© {new Date().getFullYear()} Kiln Ridge Studio</span>
        <span>Brattleboro, Vermont</span>
      </div>
    </footer>
  );
}
