// 404 page
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="py-20 text-center">
      <p className="text-5xl font-bold text-indigo-600">404</p>
      <h1 className="mt-3 text-xl font-semibold text-slate-900">Page not found</h1>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
        Go to employees
      </Link>
    </section>
  );
}

export default NotFound;
