import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const CampaignPage = () => {
  const { slug } = useParams();
  const { backendURL, products } = useContext(ShopContext);
  const [campaign, setCampaign] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const mediaSrc = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${backendURL}${url}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios.get(`${backendURL}/api/campaign/${slug}`)
      .then(({ data }) => {
        if (data.success) {
          setCampaign(data.campaign);
          setPhotos(data.photos || []);
          setBlocks(data.blocks || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, backendURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Campagne introuvable
      </div>
    );
  }

  const creditLines = campaign.description
    ? campaign.description.split("\n").filter(Boolean)
    : [];

  const hasColumns = campaign.col1Title || campaign.col1Body || campaign.col2Title || campaign.col2Body;

  // Split into pairs for 2-column layout
  const photoPairs = [];
  for (let i = 0; i < photos.length; i += 2) {
    photoPairs.push(photos.slice(i, i + 2));
  }

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      {campaign.heroImage && (
        <div className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
          {/\.(mp4|webm|mov)(\?|$)/i.test(campaign.heroImage) ? (
            <video
              src={mediaSrc(campaign.heroImage)}
              autoPlay muted loop playsInline
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
              }}
            />
          ) : (
            <img
              src={mediaSrc(campaign.heroImage)}
              alt={campaign.name}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                maxWidth: "none",
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8 text-white text-center">
            {campaign.subtitle && (
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-5 opacity-75">
                {campaign.subtitle}
              </p>
            )}
            {campaign.headline && (
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight leading-none uppercase">
                {campaign.headline}
              </h1>
            )}
            <p className="mt-5 text-xs tracking-[0.25em] uppercase opacity-60">
              {campaign.name}
            </p>
          </div>
        </div>
      )}

      {/* ── Crédits deux colonnes (style Zara) ───────────────── */}
      {hasColumns && (
        <div className="px-8 sm:px-16 md:px-28 py-16 border-b border-gray-100">
          <div className="flex justify-between">
            {(campaign.col1Title || campaign.col1Body) && (
              <div>
                {campaign.col1Title && (
                  <p className="text-xs italic text-gray-400 mb-2 tracking-wide">{campaign.col1Title}</p>
                )}
                {campaign.col1Body && campaign.col1Body.split("\n").filter(Boolean).map((line, i) => (
                  <p key={i} className="prata-regular text-2xl sm:text-3xl text-gray-900 leading-tight">{line}</p>
                ))}
              </div>
            )}
            {(campaign.col2Title || campaign.col2Body) && (
              <div className="text-right">
                {campaign.col2Title && (
                  <p className="text-xs italic text-gray-400 mb-2 tracking-wide">{campaign.col2Title}</p>
                )}
                {campaign.col2Body && campaign.col2Body.split("\n").filter(Boolean).map((line, i) => (
                  <p key={i} className="prata-regular text-2xl sm:text-3xl text-gray-900 leading-tight">{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Crédits bas de page ───────────────────────────────── */}
      {creditLines.length > 0 && (
        <div className="px-8 sm:px-16 md:px-28 py-14 border-b border-gray-100">
          <div className="flex flex-col gap-0.5">
            {creditLines.map((line, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? "prata-regular text-lg sm:text-xl italic text-gray-900 mb-4" : "text-sm text-gray-400"}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── Photos + Blocs éditoriaux ─────────────────────────── */}
      <div className="py-1">
        {photoPairs.map((pair, rowIdx) => {
          const pairNumber = rowIdx + 1;
          const blockAfter = blocks.filter(b => b.insertAfterPair === pairNumber);
          return (
            <div key={rowIdx}>
              {/* Paire de photos */}
              <div className="mb-6">
                {pair.length === 2 ? (
                  /* ── 2 photos : grille côte à côte ── */
                  <>
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {pair.map((photo) => {
                        const linked = products.find(p => String(p._id) === String(photo.productId));
                        const img = (
                          <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                            <img src={mediaSrc(photo.imageUrl)} alt={photo.caption || campaign.name}
                              className="w-full h-full object-cover object-center" />
                          </div>
                        );
                        return linked ? (
                          <Link key={photo._id} to={`/product/${linked._id}`} className="block">{img}</Link>
                        ) : (
                          <div key={photo._id}>{img}</div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-1 px-2">
                      {pair.map((photo) => {
                        const linked = products.find(p => String(p._id) === String(photo.productId));
                        const title = linked ? linked.name : photo.caption;
                        const desc = linked ? linked.description : null;
                        if (!title && !desc) return <div key={photo._id} />;
                        return (
                          <div key={photo._id} className="pr-8 py-1">
                            {title && <p className="text-base sm:text-lg font-semibold italic text-gray-900 leading-snug mb-2">{title}</p>}
                            {desc && <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{desc}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* ── 1 photo : image gauche, texte droite ── */
                  (() => {
                    const photo = pair[0];
                    const linked = products.find(p => String(p._id) === String(photo.productId));
                    const title = linked ? linked.name : photo.caption;
                    const desc = linked ? linked.description : null;
                    const imgEl = (
                      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 w-full">
                        <img src={mediaSrc(photo.imageUrl)} alt={title || campaign.name}
                          className="w-full h-full object-cover object-center" />
                      </div>
                    );
                    return (
                      <div className="flex flex-col lg:flex-row gap-0">
                        {/* Image gauche */}
                        <div className="w-full lg:w-1/2 flex-shrink-0">
                          {linked ? (
                            <Link to={`/product/${linked._id}`} className="block">{imgEl}</Link>
                          ) : imgEl}
                        </div>
                        {/* Texte droite */}
                        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 py-12 bg-white">
                          <div className="max-w-sm">
                            {title && (
                              <p className="prata-regular text-2xl sm:text-3xl italic text-gray-900 leading-snug mb-5">
                                {title}
                              </p>
                            )}
                            {desc && (
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {desc}
                              </p>
                            )}
                            {linked && (
                              <Link to={`/product/${linked._id}`}
                                className="inline-block mt-8 text-[10px] tracking-[0.25em] uppercase border-b border-black pb-0.5 hover:opacity-50 transition-opacity">
                                Voir le produit
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Blocs éditoriaux après cette paire */}
              {blockAfter.map((block) => {
                const isVideo = block.mediaUrl && /\.(mp4|webm|mov)(\?|$)/i.test(block.mediaUrl);
                const isPolaroid = block.mediaStyle === "polaroid";
                return (
                  <div key={block._id} className="py-16 px-4 sm:px-16 md:px-20 flex items-center justify-between gap-8">
                    {/* Texte gauche */}
                    <div className="flex-1 text-right">
                      {block.leftText && block.leftText.split("\n").filter(Boolean).map((line, i) => (
                        <p key={i} className="text-sm text-gray-400 leading-relaxed italic">{line}</p>
                      ))}
                    </div>

                    {/* Media centré */}
                    <div className="flex-shrink-0 w-[40vw] max-w-md flex justify-center">
                      {block.mediaUrl ? (
                        <div className={`overflow-hidden ${isPolaroid ? "bg-white p-3 pb-10 shadow-xl rotate-1" : ""}`}
                          style={isPolaroid ? { maxWidth: "320px" } : { width: "100%" }}>
                          {isVideo ? (
                            <video src={mediaSrc(block.mediaUrl)} autoPlay muted loop playsInline
                              className="w-full object-cover" />
                          ) : (
                            <img src={mediaSrc(block.mediaUrl)} alt=""
                              className="w-full object-cover" />
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Texte droite */}
                    <div className="flex-1">
                      {block.rightText && block.rightText.split("\n").filter(Boolean).map((line, i) => (
                        <p key={i} className={`text-sm leading-relaxed ${i === 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── CTA bas de page ───────────────────────────────────── */}
      {photos.some((p) => p.productId) && (
        <div className="flex justify-center py-16 border-t border-gray-100">
          <Link to="/collection"
            className="text-xs tracking-[0.25em] uppercase border-b border-black pb-0.5 hover:opacity-50 transition-opacity">
            Voir la collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignPage;
