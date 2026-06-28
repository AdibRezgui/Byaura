import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImageCropModal from "../components/ImageCropModal";
import ConfirmModal from "../components/ConfirmModal";

import { backendUrl } from "../App";
const mediaSrc = (url) => url ? (url.startsWith("http") ? url : `${backendUrl}${url}`) : null;

// ── Upload zone ────────────────────────────────────────────────────────────────
const UploadBtn = ({ onFile, label = "+", accept = "image/*", loading }) => {
  const ref = useRef();
  return (
    <button type="button" disabled={loading}
      onClick={() => ref.current.click()}
      className="text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 px-4 py-2.5 hover:border-black hover:text-black transition-colors disabled:opacity-40 whitespace-nowrap">
      {loading ? "…" : label}
      <input ref={ref} type="file" accept={accept} hidden
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
    </button>
  );
};

const Campaigns = ({ token }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null); // campaign being edited
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", headline: "", subtitle: "", description: "", col1Title: "", col1Body: "", col2Title: "", col2Body: "", active: true });
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState({});
  const [cropFile, setCropFile] = useState(null);
  const [cropCallback, setCropCallback] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: "campaign"|"photo", id, label }

  const setLoad = (k, v) => setLoading(p => ({ ...p, [k]: v }));

  const openCrop = (file, callback) => {
    setCropFile(file);
    setCropCallback(() => callback);
  };
  const closeCrop = () => { setCropFile(null); setCropCallback(null); };

  const fetchAll = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/campaign/admin/all`, { headers: { token } });
      if (data.success) setCampaigns(data.campaigns);
      else toast.error("Erreur chargement campagnes: " + data.message);
    } catch (e) {
      toast.error("Impossible de charger les campagnes: " + (e.response?.status || e.message));
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setProducts(data.products);
    } catch {}
  };

  const fetchPhotos = async (campaign) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/campaign/${campaign.slug}`, { headers: { token } });
      if (data.success) {
        setPhotos(data.photos || []);
        setBlocks(data.blocks || []);
      }
    } catch {}
  };

  useEffect(() => { fetchAll(); fetchProducts(); }, []);

  const selectCampaign = (c) => {
    setSelected(c);
    setForm({ name: c.name, slug: c.slug, headline: c.headline || "", subtitle: c.subtitle || "", description: c.description || "", col1Title: c.col1Title || "", col1Body: c.col1Body || "", col2Title: c.col2Title || "", col2Body: c.col2Body || "", active: c.active });
    fetchPhotos(c);
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    setLoad("create", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/campaign/create`, form, { headers: { token } });
      if (data.success) { toast.success("Campagne créée"); fetchAll(); setShowCreate(false); setForm({ name: "", slug: "", headline: "", subtitle: "", description: "", active: true }); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("create", false); }
  };

  const saveEdit = async () => {
    setLoad("save", true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/campaign/${selected._id}`, form, { headers: { token } });
      if (data.success) {
        toast.success("Sauvegardé");
        setSelected(data.campaign);
        fetchAll();
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("save", false); }
  };

  const doUploadHero = async (file) => {
    setLoad("hero", true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await axios.post(`${backendUrl}/api/campaign/${selected._id}/hero`, fd, { headers: { token } });
      if (data.success) { toast.success("Hero uploadé"); setSelected(p => ({ ...p, heroImage: data.url })); fetchAll(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("hero", false); }
  };

  const uploadHero = (file) => {
    if (file.type.startsWith("video/")) {
      doUploadHero(file);
    } else {
      openCrop(file, (cropped) => { closeCrop(); doUploadHero(cropped); });
    }
  };

  const [photoProductId, setPhotoProductId] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  const [blocks, setBlocks] = useState([]);
  const [blockForm, setBlockForm] = useState({ leftText: "", rightText: "", mediaStyle: "normal", insertAfterPair: 1 });
  const [blockFile, setBlockFile] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null); // block being edited inline

  const addPhoto = async (file) => {
    setLoad("photo", true);
    const fd = new FormData();
    fd.append("file", file);
    if (photoProductId) fd.append("productId", photoProductId);
    if (photoCaption) fd.append("caption", photoCaption);
    try {
      const { data } = await axios.post(`${backendUrl}/api/campaign/${selected._id}/photo`, fd, { headers: { token } });
      if (data.success) { toast.success("Photo ajoutée"); setPhotos(p => [...p, data.photo]); setPhotoProductId(""); setPhotoCaption(""); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("photo", false); }
  };

  const deletePhoto = async (photoId) => {
    try {
      await axios.delete(`${backendUrl}/api/campaign/photo/${photoId}`, { headers: { token } });
      setPhotos(p => p.filter(x => x._id !== photoId));
      toast.success("Photo supprimée");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const addBlock = async () => {
    setLoad("block", true);
    const fd = new FormData();
    if (blockFile) fd.append("file", blockFile);
    if (blockForm.leftText) fd.append("leftText", blockForm.leftText);
    if (blockForm.rightText) fd.append("rightText", blockForm.rightText);
    fd.append("mediaStyle", blockForm.mediaStyle);
    fd.append("insertAfterPair", blockForm.insertAfterPair);
    try {
      const { data } = await axios.post(`${backendUrl}/api/campaign/${selected._id}/block`, fd, { headers: { token } });
      if (data.success) {
        setBlocks(p => [...p, data.block].sort((a, b) => a.insertAfterPair - b.insertAfterPair));
        setBlockForm({ leftText: "", rightText: "", mediaStyle: "normal", insertAfterPair: 1 });
        setBlockFile(null);
        toast.success("Bloc ajouté");
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("block", false); }
  };

  const saveBlock = async (block) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/campaign/block/${block._id}`,
        { leftText: block.leftText, rightText: block.rightText, mediaStyle: block.mediaStyle, insertAfterPair: block.insertAfterPair },
        { headers: { token } });
      if (data.success) {
        setBlocks(p => p.map(b => b._id === block._id ? data.block : b).sort((a, b) => a.insertAfterPair - b.insertAfterPair));
        setEditingBlock(null);
        toast.success("Bloc sauvegardé");
      }
    } catch { toast.error("Erreur"); }
  };

  const uploadBlockMedia = async (blockId, file) => {
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await axios.post(`${backendUrl}/api/campaign/block/${blockId}/media`, fd, { headers: { token } });
      if (data.success) setBlocks(p => p.map(b => b._id === blockId ? { ...b, mediaUrl: data.url } : b));
    } catch { toast.error("Erreur upload"); }
  };

  const deleteBlock = async (blockId) => {
    try {
      await axios.delete(`${backendUrl}/api/campaign/block/${blockId}`, { headers: { token } });
      setBlocks(p => p.filter(b => b._id !== blockId));
      toast.success("Bloc supprimé");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const deleteCampaign = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/campaign/${id}`, { headers: { token } });
      toast.success("Campagne supprimée");
      if (selected?._id === id) setSelected(null);
      fetchAll();
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const inputCls = "w-full border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder:text-gray-300";
  const labelCls = "text-[10px] tracking-widest text-gray-400 uppercase block mb-1";

  return (
    <div className="flex min-h-screen">

      {/* ── Left: Campaign List ───────────────────────────────── */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 pt-8 px-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Campagnes</span>
          <button onClick={() => setShowCreate(true)}
            className="text-[10px] tracking-widest uppercase border-b border-black pb-px hover:opacity-50 transition-opacity">
            + Nouvelle
          </button>
        </div>

        <div className="flex flex-col">
          {campaigns.map((c) => (
            <button key={c._id} onClick={() => selectCampaign(c)}
              className={`text-left py-4 border-b border-gray-100 group transition-all ${selected?._id === c._id ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ml-3 flex-shrink-0 ${c.active ? "bg-gray-900" : "bg-gray-300"}`} />
              </div>
            </button>
          ))}
          {campaigns.length === 0 && (
            <p className="text-xs text-gray-300 pt-6">Aucune campagne</p>
          )}
        </div>
      </div>

      {/* ── Right: Edit Panel ─────────────────────────────────── */}
      {selected ? (
        <div className="flex-1 overflow-y-auto">

          {/* Header */}
          <div className="border-b border-gray-100 px-10 py-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-0.5">Édition</p>
              <h2 className="text-lg font-medium text-gray-900">{selected.name}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setForm(p => ({ ...p, active: !p.active }))}>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${form.active ? "bg-gray-900" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-gray-500">{form.active ? "Actif" : "Inactif"}</span>
              </div>
              <button onClick={saveEdit} disabled={loading.save}
                className="text-xs tracking-widest uppercase border border-gray-900 text-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                {loading.save ? "…" : "Sauvegarder"}
              </button>
              <button onClick={() => setConfirm({ type: "campaign", id: selected._id, label: selected.name })}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div className="px-10 py-8 flex flex-col gap-10">

            {/* Infos de base */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6">Informations</p>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {[
                  { label: "Nom", key: "name" },
                  { label: "Slug (URL)", key: "slug" },
                  { label: "Titre principal (hero)", key: "headline" },
                  { label: "Sous-titre (hero)", key: "subtitle" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
              </div>
            </section>

            {/* Crédits deux colonnes */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Crédits — deux colonnes</p>
              <p className="text-[11px] text-gray-400 mb-6">S'affichent en grand Prata de part et d'autre de la page</p>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <label className={labelCls}>Colonne gauche — titre</label>
                  <input value={form.col1Title} onChange={(e) => setForm(p => ({ ...p, col1Title: e.target.value }))}
                    placeholder="ex: Dirigé par" className={inputCls} />
                  <label className={`${labelCls} mt-4`}>Contenu (1 ligne = 1 entrée)</label>
                  <textarea value={form.col1Body} rows={3}
                    onChange={(e) => setForm(p => ({ ...p, col1Body: e.target.value }))}
                    placeholder={"Stillz\nPorto Rico, 2026"}
                    className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Colonne droite — titre</label>
                  <input value={form.col2Title} onChange={(e) => setForm(p => ({ ...p, col2Title: e.target.value }))}
                    placeholder="ex: Avec" className={inputCls} />
                  <label className={`${labelCls} mt-4`}>Contenu (1 ligne = 1 entrée)</label>
                  <textarea value={form.col2Body} rows={3}
                    onChange={(e) => setForm(p => ({ ...p, col2Body: e.target.value }))}
                    placeholder={"Benito Antonio\nMartínez Ocasio"}
                    className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            {/* Crédits bas de page */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Crédits — bas de page</p>
              <p className="text-[11px] text-gray-400 mb-6">1ère ligne en Prata italic, les suivantes en gris</p>
              <textarea value={form.description} rows={4}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder={"Collection Benito Antonio\nDirection créative de Benito Antonio Martínez Ocasio\nConception graphique par MM Paris"}
                className={`${inputCls} resize-none`} />
            </section>

            {/* Hero */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Média hero</p>
              <p className="text-[11px] text-gray-400 mb-6">Image (recadrable 16/9) ou vidéo plein écran</p>
              <div className="flex items-start gap-8">
                {selected.heroImage ? (
                  <div className="w-72 h-40 overflow-hidden bg-gray-900 flex-shrink-0 relative">
                    {/\.(mp4|webm|mov)(\?|$)/i.test(selected.heroImage) ? (
                      <video src={mediaSrc(selected.heroImage)} muted loop autoPlay playsInline
                        style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", minWidth:"100%", minHeight:"100%", width:"auto", height:"auto" }} />
                    ) : (
                      <img src={mediaSrc(selected.heroImage)} alt="hero"
                        style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", minWidth:"100%", minHeight:"100%", width:"auto", height:"auto", maxWidth:"none" }} />
                    )}
                  </div>
                ) : (
                  <div className="w-72 h-40 bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs flex-shrink-0">
                    Aucun média
                  </div>
                )}
                <div className="flex flex-col gap-3 pt-1">
                  <UploadBtn onFile={uploadHero} label="Choisir une image" accept="image/*" loading={loading.hero} />
                  <UploadBtn onFile={uploadHero} label="Choisir une vidéo" accept="video/*" loading={loading.hero} />
                </div>
              </div>
            </section>

            {/* Photos */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Photos de campagne</p>
              <p className="text-[11px] text-gray-400 mb-6">Affichées 2 par ligne — liables à un produit</p>

              <div className="flex gap-6 items-end mb-8 pb-8 border-b border-gray-100">
                <div className="flex-1">
                  <label className={labelCls}>Lier à un produit</label>
                  <select value={photoProductId} onChange={(e) => setPhotoProductId(e.target.value)}
                    className={inputCls}>
                    <option value="">— Aucun —</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Légende</label>
                  <input value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="optionnel" className={inputCls} />
                </div>
                <UploadBtn onFile={addPhoto} label="+ Ajouter" loading={loading.photo} />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {photos.map((photo, i) => {
                  const linkedProduct = products.find(p => String(p._id) === String(photo.productId));
                  return (
                    <div key={photo._id} className="relative group overflow-hidden aspect-[3/4] bg-gray-100">
                      <img src={mediaSrc(photo.imageUrl)} alt={`photo-${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button onClick={() => setConfirm({ type: "photo", id: photo._id, label: "cette photo" })}
                          className="opacity-0 group-hover:opacity-100 text-[10px] tracking-widest uppercase text-white border border-white px-3 py-1.5 transition-all hover:bg-white hover:text-black">
                          Supprimer
                        </button>
                      </div>
                      {linkedProduct && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 truncate">
                          {linkedProduct.name}
                        </div>
                      )}
                      <span className="absolute top-2 right-2 text-white text-[10px] opacity-50">{i + 1}</span>
                    </div>
                  );
                })}
                {photos.length === 0 && (
                  <div className="col-span-4 text-center py-12 text-gray-300 text-xs tracking-widest uppercase">Aucune photo</div>
                )}
              </div>
            </section>

            {/* Blocs éditoriaux */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Blocs éditoriaux</p>
              <p className="text-[11px] text-gray-400 mb-6">S'insèrent entre les paires de photos — image/vidéo centrée + textes gauche/droite</p>

              {blocks.length > 0 && (
                <div className="flex flex-col gap-4 mb-8">
                  {blocks.map((block) => {
                    const isEditing = editingBlock?._id === block._id;
                    const eb = isEditing ? editingBlock : block;
                    return (
                      <div key={block._id} className="border border-gray-100 p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tracking-widest uppercase text-gray-400">
                            Après paire {block.insertAfterPair} — {block.mediaStyle === "polaroid" ? "Polaroïd" : "Normal"}
                          </span>
                          <div className="flex gap-3">
                            {isEditing ? (
                              <>
                                <button onClick={() => saveBlock(editingBlock)}
                                  className="text-[10px] tracking-widest uppercase border border-black text-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors">
                                  Sauvegarder
                                </button>
                                <button onClick={() => setEditingBlock(null)}
                                  className="text-[10px] text-gray-400 hover:text-black transition-colors">
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setEditingBlock({ ...block })}
                                  className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                                  Modifier
                                </button>
                                <button onClick={() => setConfirm({ type: "block", id: block._id, label: "ce bloc" })}
                                  className="text-[10px] text-gray-300 hover:text-red-400 transition-colors">
                                  Supprimer
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className={labelCls}>Après paire n°</label>
                              <input type="number" min={1} value={eb.insertAfterPair}
                                onChange={e => setEditingBlock(p => ({ ...p, insertAfterPair: parseInt(e.target.value) || 1 }))}
                                className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Style média</label>
                              <select value={eb.mediaStyle}
                                onChange={e => setEditingBlock(p => ({ ...p, mediaStyle: e.target.value }))}
                                className={inputCls}>
                                <option value="normal">Normal</option>
                                <option value="polaroid">Polaroïd</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 items-start">
                          <div>
                            <label className={labelCls}>Texte gauche</label>
                            {isEditing ? (
                              <textarea value={eb.leftText || ""} rows={3}
                                onChange={e => setEditingBlock(p => ({ ...p, leftText: e.target.value }))}
                                className={`${inputCls} resize-none`} placeholder="1 ligne = 1 ligne" />
                            ) : (
                              <p className="text-xs text-gray-400 italic whitespace-pre-line">{block.leftText || "—"}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            {block.mediaUrl ? (
                              <div className={`overflow-hidden w-full ${block.mediaStyle === "polaroid" ? "bg-white p-2 pb-7 shadow" : ""}`}>
                                {/\.(mp4|webm|mov)/i.test(block.mediaUrl) ? (
                                  <video src={mediaSrc(block.mediaUrl)} muted loop autoPlay playsInline className="w-full object-cover" />
                                ) : (
                                  <img src={mediaSrc(block.mediaUrl)} alt="" className="w-full object-cover" />
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-[10px]">
                                Aucun média
                              </div>
                            )}
                            <UploadBtn onFile={(f) => uploadBlockMedia(block._id, f)} label="Changer" accept="image/*,video/*" />
                          </div>
                          <div>
                            <label className={labelCls}>Texte droite</label>
                            {isEditing ? (
                              <textarea value={eb.rightText || ""} rows={3}
                                onChange={e => setEditingBlock(p => ({ ...p, rightText: e.target.value }))}
                                className={`${inputCls} resize-none`} placeholder="1 ligne = 1 ligne" />
                            ) : (
                              <p className="text-xs text-gray-400 whitespace-pre-line">{block.rightText || "—"}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border border-dashed border-gray-200 p-5 flex flex-col gap-5">
                <p className="text-[10px] tracking-widest uppercase text-gray-400">Nouveau bloc</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Après paire n°</label>
                    <input type="number" min={1} value={blockForm.insertAfterPair}
                      onChange={e => setBlockForm(p => ({ ...p, insertAfterPair: parseInt(e.target.value) || 1 }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Style</label>
                    <select value={blockForm.mediaStyle}
                      onChange={e => setBlockForm(p => ({ ...p, mediaStyle: e.target.value }))}
                      className={inputCls}>
                      <option value="normal">Normal</option>
                      <option value="polaroid">Polaroïd</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <UploadBtn onFile={(f) => setBlockFile(f)}
                      label={blockFile ? blockFile.name.slice(0, 18) + "…" : "Choisir un média"}
                      accept="image/*,video/*" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Texte gauche</label>
                    <textarea value={blockForm.leftText} rows={3}
                      onChange={e => setBlockForm(p => ({ ...p, leftText: e.target.value }))}
                      placeholder={"Polaroïds réalisés à\nPorto Rico, 2026"}
                      className={`${inputCls} resize-none`} />
                  </div>
                  <div>
                    <label className={labelCls}>Texte droite</label>
                    <textarea value={blockForm.rightText} rows={3}
                      onChange={e => setBlockForm(p => ({ ...p, rightText: e.target.value }))}
                      placeholder={"Benito Antonio Martínez Ocasio\n10 mars 1994\nBayamón, Porto Rico"}
                      className={`${inputCls} resize-none`} />
                  </div>
                </div>
                <button onClick={addBlock} disabled={loading.block}
                  className="self-start text-[10px] tracking-widest uppercase border border-gray-900 text-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                  {loading.block ? "…" : "+ Ajouter ce bloc"}
                </button>
              </div>
            </section>

          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs tracking-widest uppercase text-gray-300">Sélectionnez une campagne</p>
        </div>
      )}

      {/* ── Create modal ─────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <form onSubmit={createCampaign}
            className="bg-white w-full max-w-md p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Nouvelle</p>
                <h2 className="text-lg font-medium text-gray-900">Campagne</h2>
              </div>
              <button type="button" onClick={() => setShowCreate(false)}
                className="text-gray-300 hover:text-black transition-colors text-lg leading-none mt-1">✕</button>
            </div>
            {[
              { label: "Nom *", key: "name", required: true, ph: "ex: Collab Été 2026" },
              { label: "Slug (URL)", key: "slug", ph: "ex: collab-ete-2026 — auto si vide" },
              { label: "Titre hero", key: "headline", ph: "ex: NOUVELLE COLLECTION" },
              { label: "Sous-titre", key: "subtitle", ph: "ex: Printemps-été 2026" },
            ].map(({ label, key, required, ph }) => {
              const computedSlug = key === "slug" && !form.slug && form.name
                ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                : null;
              const slugConflict = key === "slug" && campaigns.some(c => c.slug === (form.slug || computedSlug));
              return (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                    required={required} placeholder={ph}
                    className={`${inputCls} ${slugConflict ? "border-red-400" : ""}`} />
                  {slugConflict && <p className="text-[11px] text-red-400 mt-1">Slug déjà utilisé</p>}
                  {key === "slug" && computedSlug && !form.slug && (
                    <p className="text-[11px] text-gray-400 mt-1 font-mono">{computedSlug}</p>
                  )}
                </div>
              );
            })}
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 text-xs tracking-widest uppercase border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading.create}
                className="flex-1 py-2.5 text-xs tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-40">
                {loading.create ? "…" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={`Supprimer ${confirm.label} ?`}
          onConfirm={() => {
            if (confirm.type === "campaign") deleteCampaign(confirm.id);
            else if (confirm.type === "photo") deletePhoto(confirm.id);
            else if (confirm.type === "block") deleteBlock(confirm.id);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Crop modal */}
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspect={16 / 9}
          onConfirm={(cropped) => { cropCallback(cropped); }}
          onCancel={closeCrop}
        />
      )}
    </div>
  );
};

export default Campaigns;
