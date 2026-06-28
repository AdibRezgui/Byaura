import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

/* ── Star helpers ─────────────────────────────────────── */
const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}>
        <svg className={`w-6 h-6 ${s <= value ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
        </svg>
      </button>
    ))}
  </div>
);

const StarDisplay = ({ value, sm }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`${sm ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${s <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
      </svg>
    ))}
  </div>
);

/* ── Main component ───────────────────────────────────── */
const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendURL, token } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('');
  const [descExpanded, setDescExpanded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewAvg, setReviewAvg] = useState(0);
  const [tab, setTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [looks, setLooks] = useState([]);
  const [uploadingLook, setUploadingLook] = useState(false);
  const [selectedLook, setSelectedLook] = useState(null);
  const lookInputRef = useRef();

  useEffect(() => {
    if (!productId || !products?.length) return;
    const found = products.find(p => String(p._id) === String(productId));
    if (found) { setProductData(found); setSize(''); }
  }, [productId, products]);

  useEffect(() => {
    if (productId) { loadReviews(); loadLooks(); }
  }, [productId]);

  const loadReviews = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/review/product/${productId}`);
      if (data.success) { setReviews(data.reviews); setReviewCount(data.count); setReviewAvg(data.average); }
    } catch (_) {}
  };

  const loadLooks = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/look/product/${productId}`);
      if (data.success) setLooks(data.looks);
    } catch (_) {}
  };

  const uploadLook = async (file) => {
    if (!file) return;
    setUploadingLook(true);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('productId', productId);
      const { data } = await axios.post(`${backendURL}/api/look/upload`, form, { headers: { token } });
      if (data.success) { toast.success('Look partagé !'); loadLooks(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
    finally { setUploadingLook(false); }
  };

  const deleteLook = async (lookId) => {
    try {
      const { data } = await axios.delete(`${backendURL}/api/look/${lookId}`, { headers: { token } });
      if (data.success) { toast.success('Look supprimé'); loadLooks(); }
    } catch (_) {}
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Sélectionne une note'); return; }
    if (!comment.trim()) { toast.error('Écris un commentaire'); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${backendURL}/api/review/add`,
        { productId: Number(productId), rating, comment },
        { headers: { token } }
      );
      if (data.success) { toast.success('Avis publié !'); setRating(0); setComment(''); loadReviews(); }
      else toast.error(data.message);
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setSubmitting(false); }
  };

  if (!productData) return <div className="py-20 text-center text-sm tracking-widest text-gray-400 uppercase">Chargement…</div>;

  const images = Array.isArray(productData.images) ? productData.images : [];
  const mainImage = images[0] || '';
  const extraImages = images.slice(1);
  const isOnSale = productData.salePrice && productData.salePrice > 0 && productData.salePrice < productData.price;
  const discount = isOnSale ? Math.round((1 - productData.salePrice / productData.price) * 100) : 0;
  const DESC_LIMIT = 120;
  const descLong = (productData.description || '').length > DESC_LIMIT;

  return (
    <div>
      {/* ── Hero layout: image left / info right ──────────────── */}
      <div className="flex flex-col md:flex-row">

        {/* LEFT: image stack */}
        <div className="w-full md:w-[58%] flex-shrink-0">
          {/* Main image */}
          {mainImage && (
            <div className="w-full" style={{ minHeight: 'min(92vh, 600px)' }}>
              <img
                src={mainImage}
                alt={productData.name}
                className="w-full h-full object-cover"
                style={{ minHeight: 'min(92vh, 600px)' }}
              />
            </div>
          )}
          {/* Extra images — 2 per row, dernière image seule = pleine largeur */}
          {extraImages.length > 0 && (() => {
            const isOddCount = extraImages.length % 2 !== 0;
            const pairedImages = isOddCount ? extraImages.slice(0, -1) : extraImages;
            const lastImage = isOddCount ? extraImages[extraImages.length - 1] : null;
            return (
              <>
                {pairedImages.length > 0 && (
                  <div className="grid grid-cols-2">
                    {pairedImages.map((img, i) => (
                      <img key={i} src={img} alt={`${productData.name}-${i+2}`}
                        className="w-full aspect-[3/4] object-cover" />
                    ))}
                  </div>
                )}
                {lastImage && (
                  <img src={lastImage} alt={`${productData.name}-last`}
                    className="w-full aspect-[3/4] object-cover" />
                )}
              </>
            );
          })()}
        </div>

        {/* RIGHT: sticky info panel */}
        <div className="flex-1 relative">
          <div className="md:sticky md:top-0 md:h-screen md:overflow-y-auto flex flex-col justify-center px-6 sm:px-10 xl:px-16 py-10 md:py-12">
            <div className="max-w-sm mx-auto w-full flex flex-col gap-6">

              {/* Badge */}
              {productData.bestseller && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Bestseller</p>
              )}
              {isOnSale && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-black">Solde</p>
              )}

              {/* Name */}
              <h1 className="text-sm tracking-[0.15em] uppercase font-normal leading-relaxed text-gray-900">
                {productData.name}
              </h1>

              {/* Stars */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <StarDisplay value={reviewAvg} sm />
                  <span className="text-[11px] text-gray-400">({reviewCount})</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {isOnSale ? (
                  <>
                    <span className="text-base font-medium text-gray-900">
                      {productData.salePrice?.toLocaleString('fr-TN')} {currency}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {productData.price?.toLocaleString('fr-TN')} {currency}
                    </span>
                    <span className="text-xs text-black font-medium">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-base font-medium text-gray-900">
                    {productData.price?.toLocaleString('fr-TN')} {currency}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Sizes */}
              {productData.sizes && Object.keys(productData.sizes).length > 0 && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-3">
                    Taille {size && `— ${size}`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(productData.sizes).map(([s, stock]) => {
                      const out = stock <= 0;
                      return (
                        <button key={s} onClick={() => !out && setSize(s)} disabled={out}
                          className={`w-12 h-10 border text-xs tracking-wider transition-colors
                            ${out ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through' :
                              size === s ? 'border-black bg-black text-white' :
                              'border-gray-300 hover:border-black text-gray-700'}`}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button
                onClick={() => addToCart(productData._id, size)}
                className="w-full border border-black py-3.5 text-xs tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors duration-200"
              >
                Ajouter au panier
              </button>

              {/* Composition */}
              {productData.composition && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1">Composition</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{productData.composition}</p>
                </div>
              )}

              {/* Description */}
              {productData.description && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1">Description</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {descLong && !descExpanded
                      ? productData.description.slice(0, DESC_LIMIT) + '…'
                      : productData.description}
                  </p>
                  {descLong && (
                    <button
                      onClick={() => setDescExpanded(v => !v)}
                      className="text-[10px] tracking-widest uppercase underline text-gray-500 hover:text-black mt-1"
                    >
                      {descExpanded ? 'Voir moins' : 'Voir plus'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Description & Reviews ─────────────────────────────── */}
      <div className="border-t border-gray-100 mt-0">
        <div className="flex gap-8 px-6 pt-6 border-b border-gray-100">
          {['description', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                tab === t ? 'border-b border-black text-black' : 'text-gray-400 hover:text-black'
              }`}>
              {t === 'reviews' ? `Avis (${reviewCount})` : 'Description'}
            </button>
          ))}
        </div>

        <div className="px-6 py-8 max-w-2xl">
          {tab === 'description' ? (
            <p className="text-sm text-gray-600 leading-relaxed">{productData.description}</p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviewCount > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-4xl font-light text-gray-800">{reviewAvg.toFixed(1)}</p>
                  <div>
                    <StarDisplay value={reviewAvg} />
                    <p className="text-xs text-gray-400 mt-1">{reviewCount} avis</p>
                  </div>
                </div>
              )}

              {token ? (
                <form onSubmit={submitReview} className="border border-gray-100 rounded-lg p-5 flex flex-col gap-4">
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-500">Laisser un avis</p>
                  <StarInput value={rating} onChange={setRating} />
                  <textarea value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec ce produit…"
                    rows={3}
                    className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-black" />
                  <button type="submit" disabled={submitting}
                    className="self-start border border-black px-6 py-2 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50">
                    {submitting ? 'Envoi…' : 'Publier'}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-400">
                  <a href="/login" className="underline hover:text-black">Connectez-vous</a> pour laisser un avis.
                </p>
              )}

              <div className="flex flex-col gap-5">
                {reviews.map(review => (
                  <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        {review.userProfileImage ? (
                          <img src={review.userProfileImage.startsWith('http') ? review.userProfileImage : `${backendURL}${review.userProfileImage}`}
                            alt={review.userName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                            {review.userName?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <p className="text-xs font-medium tracking-wide">{review.userName}</p>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <StarDisplay value={review.rating} sm />
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">Aucun avis pour l'instant.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Looks ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs tracking-[0.3em] uppercase text-gray-800">Looks</h2>
            <p className="text-[11px] text-gray-400 mt-1">Partagez votre style avec cet article</p>
          </div>
          {token ? (
            <>
              <button onClick={() => lookInputRef.current.click()} disabled={uploadingLook}
                className="border border-black text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-black hover:text-white transition-colors disabled:opacity-50">
                {uploadingLook ? 'Envoi…' : '+ Partager mon look'}
              </button>
              <input ref={lookInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files[0] && uploadLook(e.target.files[0])} />
            </>
          ) : (
            <a href="/login" className="text-[11px] text-gray-400 underline hover:text-black">
              Connectez-vous pour partager
            </a>
          )}
        </div>

        {looks.length === 0 ? (
          <div className="border border-dashed border-gray-200 py-16 text-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-300">Aucun look pour l'instant</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
            {looks.map(look => {
              const imgSrc = look.imageUrl?.startsWith('http') ? look.imageUrl : `${backendURL}${look.imageUrl}`;
              const avatarSrc = look.userProfileImage
                ? (look.userProfileImage.startsWith('http') ? look.userProfileImage : `${backendURL}${look.userProfileImage}`)
                : null;
              let isOwner = false;
              try { isOwner = token && String(look.userId) === String(JSON.parse(atob(token.split('.')[1])).id); } catch(_) {}

              return (
                <div key={look.id} className="relative break-inside-avoid group overflow-hidden cursor-pointer"
                  onClick={() => setSelectedLook(look)}>
                  <img src={imgSrc} alt="look" className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      {avatarSrc
                        ? <img src={avatarSrc} alt={look.userName} className="w-6 h-6 rounded-full object-cover border border-white" />
                        : <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-black">{look.userName?.[0]?.toUpperCase()}</div>
                      }
                      <p className="text-white text-[10px] tracking-wider">{look.userName}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <button onClick={e => { e.stopPropagation(); deleteLook(look.id); }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {selectedLook && (() => {
        const look = selectedLook;
        const imgSrc = look.imageUrl?.startsWith('http') ? look.imageUrl : `${backendURL}${look.imageUrl}`;
        const avatarSrc = look.userProfileImage
          ? (look.userProfileImage.startsWith('http') ? look.userProfileImage : `${backendURL}${look.userProfileImage}`)
          : null;
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedLook(null)}>
            <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <img src={imgSrc} alt="look" className="w-full object-contain max-h-[80vh]" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <div className="flex items-center gap-3">
                  {avatarSrc
                    ? <img src={avatarSrc} alt={look.userName} className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                    : <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black">{look.userName?.[0]?.toUpperCase()}</div>
                  }
                  <div>
                    <p className="text-white text-sm">{look.userName}</p>
                    <p className="text-white/50 text-[11px]">
                      {new Date(look.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedLook(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black text-white flex items-center justify-center text-sm">
                ✕
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Related products ──────────────────────────────────── */}
      <div className="border-t border-gray-100 px-0 py-10">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  );
};

export default Product;
