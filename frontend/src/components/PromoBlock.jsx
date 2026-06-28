import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const PromoBlock = ({ prefix = "promo" }) => {
  const { siteConfig, backendURL } = useContext(ShopContext);

  const title = siteConfig?.[`${prefix}Title`];
  const desc  = siteConfig?.[`${prefix}Description`];
  const rawLink = siteConfig?.[`${prefix}Link`] || "collection";
  const linkTo = rawLink.startsWith("campaign:")
    ? `/campaign/${rawLink.replace("campaign:", "")}`
    : "/collection";

  const toSrc = (url) =>
    url ? (url.startsWith("http") ? url : `${backendURL}${url}`) : null;

  const images = [1, 2, 3, 4]
    .map((n) => toSrc(siteConfig?.[`${prefix}Image${n}`]))
    .filter(Boolean);

  if (images.length === 0) return null;

  const is4 = images.length >= 3; // 3 or 4 → 2×2 grid

  return (
    <div className="w-full overflow-hidden">
      {(title || desc) && (
        <div className="px-4 sm:px-8 py-10 text-center">
          {title && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.15em] uppercase text-gray-900">
              {title}
            </h2>
          )}
          {desc && (
            <p className="mt-3 text-sm text-gray-400 tracking-widest uppercase max-w-xl mx-auto">
              {desc}
            </p>
          )}
        </div>
      )}

      {is4 ? (
        /* ── 2×2 grid ──────────────────────────────────────────────── */
        <div className="grid grid-cols-2" style={{ height: "clamp(520px, 80vw, 960px)" }}>
          {images.slice(0, 4).map((src, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={src}
                alt={`bloc-${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
          {/* Fill empty slots so grid stays 2×2 */}
          {Array.from({ length: Math.max(0, 4 - images.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-100" />
          ))}
        </div>
      ) : (
        /* ── 1 or 2 images side by side ─────────────────────────────── */
        <div className="flex w-full" style={{ height: "clamp(380px, 60vw, 720px)" }}>
          {images.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden group"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={src}
                alt={`bloc-${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {i === images.length - 1 && images.length > 1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center py-6">
        <Link
          to={linkTo}
          className="text-xs tracking-[0.3em] uppercase border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
        >
          Découvrir
        </Link>
      </div>
    </div>
  );
};

export default PromoBlock;
