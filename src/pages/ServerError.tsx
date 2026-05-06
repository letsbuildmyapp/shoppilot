import { Link, useRouteError } from 'react-router-dom';

export default function ServerError() {
  const err = useRouteError() as Error | undefined;
  return (
    <div className="container-edit py-32 text-center">
      <p className="eyebrow mb-3">Error · 500</p>
      <h1 className="display-xl">Something broke.</h1>
      <p className="text-coal-mute mt-6 max-w-[50ch] mx-auto">
        We've logged the issue. Try again or head back home.
      </p>
      {err?.message && (
        <pre className="mt-6 text-xs text-coal-mute bg-bone-100 border border-line p-4 max-w-prose mx-auto text-left overflow-x-auto">
          {err.message}
        </pre>
      )}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">Home</Link>
        <button onClick={() => window.location.reload()} className="btn-outline">Try again</button>
      </div>
    </div>
  );
}
