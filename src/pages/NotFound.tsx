import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-edit py-32 text-center">
      <p className="eyebrow mb-3">Error · 404</p>
      <h1 className="display-xl">Page not found.</h1>
      <p className="text-coal-mute mt-6 max-w-[40ch] mx-auto">
        The piece you're looking for may have sold or moved. Try the shop or head home.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Browse the shop</Link>
        <Link to="/" className="btn-outline">Home</Link>
      </div>
    </div>
  );
}
