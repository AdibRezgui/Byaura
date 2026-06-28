import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const LookDetail = () => {
  const { id } = useParams();
  const { backendURL, products, addToCart } = useContext(ShopContext);
  const [look, setLook] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const src = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${backendURL}${url}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${backendURL}/api/lookbook/${id}`)
      .then(({ data }) => {
        if (data.success) {
          setLook(data.look);
          setPhotos(data.photos || []);
          setItems(data.items || []);
        }
      })
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!look) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Look introuvable
    </div>
  );

  const handleAdd = (product) => {
    const firstSize = Object.keys(product.sizes || {})[0] || "";
    addToCart(product._id, firstSize);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const frontPhoto = photos[0] || null;
  const backPhoto  = photos[1] || photos[0] || null;

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">

      {/* ══════════════════════════════════════════════════════════
          BLOC PRODUITS
          Gauche : UNE photo éditoriale sticky, affichée en entier
          Droite  : scroll à travers tous les articles
      ══════════════════════════════════════════════════════════ */}
      {items.length > 0 && (
        <div className="flex flex-col lg:flex-row">

          {/* ── Gauche : photo éditoriale UNIQUE sticky ── */}
          <div className="hidden lg:block lg:w-1/2 flex-shrink-0">
            <div className="sticky top-0 h-screen flex items-center justify-center bg-[#f5f5f5]">
              {frontPhoto ? (
                <img
                  src={src(frontPhoto.imageUrl)}
                  alt={look.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
          </div>

          {/* ── Droite : articles (scroll) ── */}
          <div className="w-full lg:w-1/2">
            {items.map((item) => {
              const product = products.find(p => String(p._id) === String(item.productId));
              const isAdded = addedId === product?._id;
              const price = product?.salePrice || product?.price;
              const originalPrice = product?.salePrice ? product?.price : null;

              return (
                <div key={item._id}
                  className="flex flex-col items-center justify-center min-h-[70vh] lg:min-h-screen border-b border-gray-100 bg-white py-12 px-5 sm:px-8">

                  {/* Photo catalogue du produit — entière */}
                  {item.imageUrl && (
                    <Link to={product ? `/product/${product._id}` : "#"}
                      className="block w-full flex justify-center">
                      <img
                        src={src(item.imageUrl)}
                        alt={product?.name || ""}
                        className="object-contain"
                        style={{ maxHeight: "65vh", maxWidth: "100%", width: "auto" }}
                      />
                    </Link>
                  )}

                  {/* Infos */}
                  <div className="mt-8 flex flex-col items-center gap-2 text-center">
                    {product && (
                      <Link to={`/product/${product._id}`}
                        className="text-[10px] tracking-[0.25em] uppercase text-gray-400 hover:text-black transition-colors">
                        {product.name}
                      </Link>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-900">{price} TND</span>
                      {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{originalPrice} TND</span>
                      )}
                    </div>
                    {product && (
                      <button onClick={() => handleAdd(product)}
                        className={`mt-2 w-9 h-9 border flex items-center justify-center transition-all ${
                          isAdded ? "bg-black border-black text-white" : "border-gray-300 hover:border-black"
                        }`}>
                        {isAdded ? (
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION FINALE
          Gauche : nom + description + retour
          Droite : 2ème photo (dos) entière
      ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Gauche : texte éditorial */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-14 bg-white">
          <Link to="/lookbook"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-black transition-colors mb-12">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Lookbook
          </Link>
          <h1 className="prata-regular text-3xl sm:text-4xl italic text-gray-900 mb-6 leading-snug">
            {look.name}
          </h1>
          {look.description && (
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">{look.description}</p>
          )}
          <div className="mt-12">
            <Link to="/collection"
              className="text-[10px] tracking-[0.3em] uppercase border-b border-gray-300 pb-0.5 hover:border-black transition-colors">
              Voir la collection
            </Link>
          </div>
        </div>

        {/* Droite : 2ème photo (dos) — entière */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f5f5] min-h-[60vh]">
          {backPhoto ? (
            <img
              src={src(backPhoto.imageUrl)}
              alt={`${look.name} — dos`}
              className="object-contain w-full h-full"
              style={{ maxHeight: "100vh" }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 min-h-[60vh]" />
          )}
        </div>
      </div>

    </div>
  );
};

export default LookDetail;
