import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Lookbook = () => {
  const { backendURL } = useContext(ShopContext);
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const mediaSrc = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${backendURL}${url}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${backendURL}/api/lookbook`)
      .then(({ data }) => { if (data.success) setLooks(data.looks); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] min-h-screen">
      {/* Header */}
      <div className="px-8 sm:px-16 pt-16 pb-10 border-b border-gray-100">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2">Éditorial</p>
        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">Lookbook</h1>
      </div>

      {/* Grille */}
      {looks.length === 0 ? (
        <div className="flex items-center justify-center py-32 text-gray-300 text-xs tracking-widest uppercase">
          Aucun look disponible
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((entry) => {
            const look = entry.look;
            const firstPhoto = entry.photos?.[0];
            return (
              <Link key={look._id} to={`/lookbook/${look._id}`}
                className="group relative overflow-hidden bg-[#f5f5f5] block">
                {firstPhoto ? (
                  <img src={mediaSrc(firstPhoto.imageUrl)} alt={look.name}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase">
                    Aucune photo
                  </div>
                )}
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                {/* Label bas */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white text-xs tracking-[0.2em] uppercase font-light">{look.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Labels sous la grille */}
      {looks.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-gray-100`}>
          {looks.map((entry) => {
            const look = entry.look;
            return (
              <Link key={look._id} to={`/lookbook/${look._id}`}
                className="px-6 py-6 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors group">
                <p className="text-sm font-medium italic text-gray-900 mb-2 group-hover:underline">{look.name}</p>
                {look.description && (
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{look.description}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Lookbook;
