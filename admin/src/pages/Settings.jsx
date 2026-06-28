import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImageCropModal from "../components/ImageCropModal";
import ConfirmModal from "../components/ConfirmModal";
import { backendUrl } from "../App";

const mediaSrc = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${backendUrl}${url}`;
};

const UploadZone = ({ label, accept, onUpload, loading }) => {
  const inputRef = useRef();
  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      className={`border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">+</div>
      <p className="text-sm text-gray-500">{loading ? "Chargement…" : label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
};

const Settings = ({ token }) => {
  const [config, setConfig] = useState({ heroSlides: [], aboutImage: null, contactImage: null, logo: null, promoImage1: null, promoImage2: null, promoImage3: null, promoImage4: null, block2Image1: null, block2Image2: null, block2Image3: null, block2Image4: null });
  const [loading, setLoading] = useState({});
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [block2Title, setBlock2Title] = useState("");
  const [block2Desc, setBlock2Desc] = useState("");
  const [promoLink, setPromoLink] = useState("collection");
  const [block2Link, setBlock2Link] = useState("collection");
  const [confirmSlide, setConfirmSlide] = useState(null);
  const [confirmMedia, setConfirmMedia] = useState(null); // { dbKey, label }
  const [campaigns, setCampaigns] = useState([]);

  // Crop modal state
  const [cropFile, setCropFile] = useState(null);
  const [cropCallback, setCropCallback] = useState(null);
  const [cropAspect, setCropAspect] = useState(undefined);

  const openCrop = (file, callback, aspect) => {
    setCropFile(file);
    setCropCallback(() => callback);
    setCropAspect(aspect);
  };
  const closeCrop = () => { setCropFile(null); setCropCallback(null); };

  const fetchConfig = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/config`);
      if (data.success) {
        setConfig(data);
        setPromoTitle(data.promoTitle || "");
        setPromoDesc(data.promoDescription || "");
        setBlock2Title(data.block2Title || "");
        setBlock2Desc(data.block2Description || "");
        setPromoLink(data.promoLink || "collection");
        setBlock2Link(data.block2Link || "collection");
      }
    } catch { toast.error("Erreur chargement config"); }
  };

  useEffect(() => {
    fetchConfig();
    axios.get(`${backendUrl}/api/campaign/admin/all`, { headers: { token } })
      .then(({ data }) => { if (data.success) setCampaigns(data.campaigns || []); })
      .catch(() => {});
  }, []);

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  const uploadHero = async (file) => {
    setLoad("hero", true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axios.post(`${backendUrl}/api/config/hero`, form, { headers: { token } });
      if (data.success) { toast.success("Slide ajoutée"); fetchConfig(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur upload"); }
    finally { setLoad("hero", false); }
  };

  const removeHero = async (index) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/config/hero/${index}`, { headers: { token } });
      if (data.success) { toast.success("Slide supprimée"); fetchConfig(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur réseau"); }
  };

  const savePromoLink = async (val) => {
    try {
      await axios.post(`${backendUrl}/api/config/promo/link`, { link: val }, { headers: { token, "Content-Type": "application/json" } });
      toast.success("Lien bloc 1 sauvegardé");
    } catch { toast.error("Erreur"); }
  };

  const saveBlock2Link = async (val) => {
    try {
      await axios.post(`${backendUrl}/api/config/block2/link`, { link: val }, { headers: { token, "Content-Type": "application/json" } });
      toast.success("Lien bloc 2 sauvegardé");
    } catch { toast.error("Erreur"); }
  };

  const saveBlock2Text = async () => {
    setLoad("block2Text", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/config/block2/text`,
        { title: block2Title, description: block2Desc },
        { headers: { token, "Content-Type": "application/json" } }
      );
      if (data.success) toast.success("Bloc 2 sauvegardé");
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("block2Text", false); }
  };

  const savePromoText = async () => {
    setLoad("promoText", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/config/promo/text`,
        { title: promoTitle, description: promoDesc },
        { headers: { token, "Content-Type": "application/json" } }
      );
      if (data.success) toast.success("Texte sauvegardé");
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("promoText", false); }
  };

  const removeMedia = async (dbKey) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/config/media/${dbKey}`, { headers: { token } });
      if (data.success) { toast.success("Image supprimée"); fetchConfig(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur réseau"); }
  };

  const uploadMedia = async (key, endpoint, file) => {
    setLoad(key, true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axios.post(`${backendUrl}/api/config/${endpoint}`, form, { headers: { token } });
      if (data.success) { toast.success("Image mise à jour"); fetchConfig(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur upload"); }
    finally { setLoad(key, false); }
  };

  return (
    <>
    <div className="p-6 flex flex-col gap-8 max-w-4xl">
      <h1 className="text-xl font-semibold text-gray-800">Médias du site</h1>

      {/* ── Hero Slides ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Slides Hero</h2>
            <p className="text-xs text-gray-400 mt-0.5">Images ou vidéos affichées en haut de la page d'accueil</p>
          </div>
          <span className="text-xs text-gray-400">{config.heroSlides?.length || 0} slide(s)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(config.heroSlides || []).map((slide, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
              {slide.type === "video" ? (
                <video src={mediaSrc(slide.url)} className="w-full h-full object-cover" muted />
              ) : (
                <img src={mediaSrc(slide.url)} alt={`slide-${i}`} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button onClick={() => setConfirmSlide(i)} className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg transition-all shadow">
                  Supprimer
                </button>
              </div>
              <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">
                {slide.type === "video" ? "Vidéo" : "Image"}
              </span>
            </div>
          ))}
          <UploadZone
            label="Ajouter une slide (image ou vidéo)"
            accept="image/*,video/*"
            onUpload={(file) => {
              if (file.type.startsWith("image/")) openCrop(file, (cropped) => { closeCrop(); uploadHero(cropped); }, 16/9);
              else uploadHero(file);
            }}
            loading={loading.hero}
          />
        </div>
      </section>

      {/* ── Bloc Promo ──────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Bloc Éditorial — Page d'accueil</h2>
        <p className="text-xs text-gray-400 mb-5">Affiché entre le hero et les collections. Deux images côte à côte avec un titre.</p>

        {/* Texte */}
        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Titre</label>
            <input
              value={promoTitle}
              onChange={(e) => setPromoTitle(e.target.value)}
              placeholder="ex: Nouvelle Collection Été"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description courte</label>
            <input
              value={promoDesc}
              onChange={(e) => setPromoDesc(e.target.value)}
              placeholder="ex: Découvrez les pièces incontournables"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button
            onClick={savePromoText}
            disabled={loading.promoText}
            className="self-start bg-black text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading.promoText ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>

        {/* Destination du lien */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 mb-1 block">Lien "Découvrir" — destination</label>
          <select value={promoLink}
            onChange={(e) => { setPromoLink(e.target.value); savePromoLink(e.target.value); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white">
            <option value="collection">Collection générale</option>
            {campaigns.map(c => (
              <option key={c._id} value={`campaign:${c.slug}`}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Images — 2 ou 4 */}
        <p className="text-xs text-gray-400 mb-3">Ajoutez 2 images (côte à côte) ou 4 images (grille 2×2)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "promoImage1", endpoint: "promo/image1", dbKey: "promo_image_1", load: "promo1", label: "Image 1" },
            { key: "promoImage2", endpoint: "promo/image2", dbKey: "promo_image_2", load: "promo2", label: "Image 2" },
            { key: "promoImage3", endpoint: "promo/image3", dbKey: "promo_image_3", load: "promo3", label: "Image 3 (opt.)" },
            { key: "promoImage4", endpoint: "promo/image4", dbKey: "promo_image_4", load: "promo4", label: "Image 4 (opt.)" },
          ].map(({ key, endpoint, dbKey, load, label }) => (
            <div key={key}>
              <p className="text-xs text-gray-500 mb-2">{label}</p>
              {config[key] ? (
                <div className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 mb-2">
                  <img src={mediaSrc(config[key])} alt={label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button onClick={() => setConfirmMedia({ dbKey, label })}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg transition-all shadow">
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-2">Aucune</div>
              )}
              <UploadZone label="+" accept="image/*"
                onUpload={(f) => openCrop(f, (c) => { closeCrop(); uploadMedia(load, endpoint, c); })}
                loading={loading[load]} />
            </div>
          ))}
        </div>

      </section>

      {/* ── Bloc Éditorial 2 ────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Bloc Éditorial 2 — Page d'accueil</h2>
        <p className="text-xs text-gray-400 mb-5">Second bloc affiché sous le premier. Même fonctionnement : titre + 2 images côte à côte.</p>

        <div className="flex flex-col gap-3 mb-6">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Titre</label>
            <input value={block2Title} onChange={(e) => setBlock2Title(e.target.value)}
              placeholder="ex: Exclusivités de saison"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description courte</label>
            <input value={block2Desc} onChange={(e) => setBlock2Desc(e.target.value)}
              placeholder="ex: Pièces en édition limitée"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <button onClick={saveBlock2Text} disabled={loading.block2Text}
            className="self-start bg-black text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading.block2Text ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>

        {/* Destination du lien */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 mb-1 block">Lien "Découvrir" — destination</label>
          <select value={block2Link}
            onChange={(e) => { setBlock2Link(e.target.value); saveBlock2Link(e.target.value); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black bg-white">
            <option value="collection">Collection générale</option>
            {campaigns.map(c => (
              <option key={c._id} value={`campaign:${c.slug}`}>{c.name}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-400 mb-3">Ajoutez 2 images (côte à côte) ou 4 images (grille 2×2)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "block2Image1", endpoint: "block2/image1", dbKey: "block2_image_1", load: "b2img1", label: "Image 1" },
            { key: "block2Image2", endpoint: "block2/image2", dbKey: "block2_image_2", load: "b2img2", label: "Image 2" },
            { key: "block2Image3", endpoint: "block2/image3", dbKey: "block2_image_3", load: "b2img3", label: "Image 3 (opt.)" },
            { key: "block2Image4", endpoint: "block2/image4", dbKey: "block2_image_4", load: "b2img4", label: "Image 4 (opt.)" },
          ].map(({ key, endpoint, dbKey, load, label }) => (
            <div key={key}>
              <p className="text-xs text-gray-500 mb-2">{label}</p>
              {config[key] ? (
                <div className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 mb-2">
                  <img src={mediaSrc(config[key])} alt={label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button onClick={() => setConfirmMedia({ dbKey, label })}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg transition-all shadow">
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-2">Aucune</div>
              )}
              <UploadZone label="+" accept="image/*"
                onUpload={(f) => openCrop(f, (c) => { closeCrop(); uploadMedia(load, endpoint, c); })}
                loading={loading[load]} />
            </div>
          ))}
        </div>
      </section>

      {/* ── About Image ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Image — Page About</h2>
        <p className="text-xs text-gray-400 mb-4">Photo affichée dans la section "À propos"</p>
        <div className="flex items-start gap-6">
          {config.aboutImage
            ? <img src={mediaSrc(config.aboutImage)} alt="about" className="w-40 h-40 rounded-xl object-cover border border-gray-100" />
            : <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Aucune</div>
          }
          <UploadZone label="Changer l'image About" accept="image/*" onUpload={(f) => openCrop(f, (c) => { closeCrop(); uploadMedia("about", "about", c); })} loading={loading.about} />
        </div>
      </section>

      {/* ── Contact Image ───────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Image — Page Contact</h2>
        <p className="text-xs text-gray-400 mb-4">Photo affichée dans la section "Nous contacter"</p>
        <div className="flex items-start gap-6">
          {config.contactImage
            ? <img src={mediaSrc(config.contactImage)} alt="contact" className="w-40 h-40 rounded-xl object-cover border border-gray-100" />
            : <div className="w-40 h-40 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Aucune</div>
          }
          <UploadZone label="Changer l'image Contact" accept="image/*" onUpload={(f) => openCrop(f, (c) => { closeCrop(); uploadMedia("contact", "contact", c); })} loading={loading.contact} />
        </div>
      </section>

      {/* ── Logo ────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Logo</h2>
        <p className="text-xs text-gray-400 mb-4">Logo affiché dans la barre de navigation</p>
        <div className="flex items-start gap-6">
          {config.logo
            ? <img src={mediaSrc(config.logo)} alt="logo" className="h-14 object-contain border border-gray-100 rounded-xl p-2 bg-gray-50" />
            : <div className="w-40 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Logo actuel (assets)</div>
          }
          <UploadZone label="Changer le logo" accept="image/*" onUpload={(f) => openCrop(f, (c) => { closeCrop(); uploadMedia("logo", "logo", c); })} loading={loading.logo} />
        </div>
      </section>

      {/* ── Login Video ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Vidéo — Page Login</h2>
        <p className="text-xs text-gray-400 mb-4">Vidéo ou image affichée en arrière-plan de la page de connexion</p>
        <div className="flex items-start gap-6">
          {config.loginVideo ? (
            <div className="relative rounded-xl overflow-hidden w-48 aspect-video bg-gray-100">
              <video src={mediaSrc(config.loginVideo)} className="w-full h-full object-cover" muted />
              <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">Vidéo</span>
            </div>
          ) : (
            <div className="w-48 aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Vidéo actuelle (assets)</div>
          )}
          <UploadZone label="Changer la vidéo Login (ou image)" accept="video/*,image/*" onUpload={(file) => uploadMedia("loginVideo", "login", file)} loading={loading.loginVideo} />
        </div>
      </section>
    </div>

    {/* ── Crop Modal ───────────────────────────────────────────────────── */}
    {cropFile && (
      <ImageCropModal
        file={cropFile}
        aspect={cropAspect}
        onConfirm={(croppedFile) => cropCallback && cropCallback(croppedFile)}
        onCancel={closeCrop}
      />
    )}
    {confirmSlide !== null && (
      <ConfirmModal
        message="Supprimer cette slide ?"
        onConfirm={() => { removeHero(confirmSlide); setConfirmSlide(null); }}
        onCancel={() => setConfirmSlide(null)}
      />
    )}
    {confirmMedia !== null && (
      <ConfirmModal
        message={`Supprimer "${confirmMedia.label}" ?`}
        onConfirm={() => { removeMedia(confirmMedia.dbKey); setConfirmMedia(null); }}
        onCancel={() => setConfirmMedia(null)}
      />
    )}
    </>
  );
};

export default Settings;
