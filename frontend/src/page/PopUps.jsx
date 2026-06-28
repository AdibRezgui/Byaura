import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PopUps = () => {
  const { backendURL } = useContext(ShopContext);
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState({});

  const src = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${backendURL}${url}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${backendURL}/api/popups`)
      .then(({ data }) => { if (data.success) setPopups(data.popups); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [backendURL]);

  const setIdx = (id, idx) => setPhotoIdx(p => ({ ...p, [id]: idx }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (popups.length === 0) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm tracking-widest uppercase">
      Aucun pop-up en cours
    </div>
  );

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">
      {popups.map((entry) => {
        const popup = entry.popup;
        const photos = entry.photos || [];
        const currentIdx = photoIdx[popup._id] || 0;
        const currentPhoto = photos[currentIdx];

        return (
          <section key={popup._id} className="relative min-h-screen flex flex-col">

            {/* ── Fond plein écran ── */}
            <div className="relative flex-1 min-h-screen overflow-hidden">
              {currentPhoto ? (
                <img
                  src={src(currentPhoto.imageUrl)}
                  alt={popup.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}

              {/* Overlay sombre dégradé */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

              {/* Navigation photos (si plusieurs) */}
              {photos.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setIdx(popup._id, i)}
                      className={`w-6 h-0.5 transition-all ${i === currentIdx ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              )}

              {/* Contenu centré sur l'image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-12 lg:px-20">
                <h1 className="prata-regular text-3xl sm:text-4xl lg:text-6xl text-white font-light mb-4 leading-tight">
                  {popup.name}
                </h1>
                {popup.place && (
                  <span className="text-xs tracking-[0.35em] uppercase text-white/90 mb-4">
                    {popup.place}
                  </span>
                )}
                {popup.date && (
                  <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-8">
                    {popup.date}
                  </p>
                )}
                {popup.description && (
                  <p className="text-sm text-white/90 leading-relaxed max-w-2xl text-center">
                    {popup.description}
                  </p>
                )}
              </div>
            </div>

          </section>
        );
      })}
    </div>
  );
};

export default PopUps;
