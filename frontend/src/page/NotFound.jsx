import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
    <p className="text-[10px] tracking-[0.45em] uppercase text-gray-300 mb-6">Erreur</p>
    <h1 className="prata-regular text-7xl sm:text-9xl font-light text-gray-900 leading-none mb-4">404.</h1>
    <p className="text-sm text-gray-400 tracking-wide mb-10">Cette page n'existe pas ou a été déplacée.</p>
    <Link
      to="/collection"
      className="text-[11px] tracking-[0.3em] uppercase border-b border-gray-900 pb-0.5 hover:opacity-40 transition-opacity"
    >
      Retour à la collection →
    </Link>
  </div>
);

export default NotFound;
