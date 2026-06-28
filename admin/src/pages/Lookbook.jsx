import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

import { backendUrl } from "../App";
const mediaSrc = (url) => url ? (url.startsWith("http") ? url : `${backendUrl}${url}`) : null;

const UploadBtn = ({ onFile, label = "+", loading, accept = "image/*" }) => {
  const ref = useRef();
  return (
    <button type="button" disabled={loading} onClick={() => ref.current.click()}
      className="text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 px-4 py-2.5 hover:border-black hover:text-black transition-colors disabled:opacity-40 whitespace-nowrap">
      {loading ? "…" : label}
      <input ref={ref} type="file" accept={accept} hidden
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
    </button>
  );
};

const inputCls = "w-full border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder:text-gray-300";
const labelCls = "text-[10px] tracking-widest text-gray-400 uppercase block mb-1";

const Lookbook = ({ token }) => {
  const [looks, setLooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [loading, setLoading] = useState({});
  const [confirm, setConfirm] = useState(null);

  // New item form
  const [newItemProductId, setNewItemProductId] = useState("");
  const [newItemFile, setNewItemFile] = useState(null);

  const setLoad = (k, v) => setLoading(p => ({ ...p, [k]: v }));

  const fetchAll = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/lookbook/admin/all`, { headers: { token } });
      if (data.success) setLooks(data.looks);
    } catch { toast.error("Erreur chargement lookbook"); }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setProducts(data.products);
    } catch {}
  };

  useEffect(() => { fetchAll(); fetchProducts(); }, []);

  const selectLook = (entry) => {
    const look = entry.look;
    setSelected(look);
    setPhotos(entry.photos || []);
    setItems(entry.items || []);
    setForm({ name: look.name || "", description: look.description || "", active: look.active });
    setNewItemProductId("");
    setNewItemFile(null);
  };

  const createLook = async (e) => {
    e.preventDefault();
    setLoad("create", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/lookbook/create`,
        { name: createName }, { headers: { token } });
      if (data.success) {
        toast.success("Look créé");
        setCreateName("");
        setShowCreate(false);
        await fetchAll();
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("create", false); }
  };

  const saveEdit = async () => {
    setLoad("save", true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/lookbook/${selected._id}`,
        { ...form }, { headers: { token } });
      if (data.success) { toast.success("Sauvegardé"); fetchAll(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("save", false); }
  };

  const addPhoto = async (file) => {
    setLoad("photo", true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await axios.post(`${backendUrl}/api/lookbook/${selected._id}/photo`, fd, { headers: { token } });
      if (data.success) { setPhotos(p => [...p, data.photo]); toast.success("Photo ajoutée"); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("photo", false); }
  };

  const deletePhoto = async (photoId) => {
    try {
      await axios.delete(`${backendUrl}/api/lookbook/photo/${photoId}`, { headers: { token } });
      setPhotos(p => p.filter(x => x._id !== photoId));
      toast.success("Photo supprimée");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const addItem = async () => {
    if (!newItemProductId && !newItemFile) return toast.error("Choisissez au moins un produit ou une photo");
    setLoad("item", true);
    const fd = new FormData();
    if (newItemFile) fd.append("file", newItemFile);
    if (newItemProductId) fd.append("productId", newItemProductId);
    try {
      const { data } = await axios.post(`${backendUrl}/api/lookbook/${selected._id}/item`, fd, { headers: { token } });
      if (data.success) {
        setItems(p => [...p, data.item]);
        setNewItemProductId("");
        setNewItemFile(null);
        toast.success("Article ajouté");
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("item", false); }
  };

  const uploadItemImage = async (itemId, file) => {
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await axios.post(`${backendUrl}/api/lookbook/item/${itemId}/image`, fd, { headers: { token } });
      if (data.success) setItems(p => p.map(it => it._id === itemId ? { ...it, imageUrl: data.url } : it));
    } catch { toast.error("Erreur upload photo"); }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${backendUrl}/api/lookbook/item/${itemId}`, { headers: { token } });
      setItems(p => p.filter(it => it._id !== itemId));
      toast.success("Article supprimé");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const deleteLook = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/lookbook/${id}`, { headers: { token } });
      if (data.success) {
        toast.success("Look supprimé");
        if (selected?._id === id) setSelected(null);
        await fetchAll();
      } else {
        toast.error(data.message || "Erreur lors de la suppression");
      }
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Liste gauche */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 pt-8 px-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Lookbook</span>
          <button onClick={() => setShowCreate(true)}
            className="text-[10px] tracking-widest uppercase border-b border-black pb-px hover:opacity-50 transition-opacity">
            + Nouveau
          </button>
        </div>
        <div className="flex flex-col">
          {looks.map((entry) => (
            <button key={entry.look._id} onClick={() => selectLook(entry)}
              className={`text-left py-4 border-b border-gray-100 transition-all ${selected?._id === entry.look._id ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {entry.photos?.[0] && (
                    <img src={mediaSrc(entry.photos[0].imageUrl)} alt=""
                      className="w-10 h-12 object-cover object-top flex-shrink-0 bg-gray-100" />
                  )}
                  <p className="text-sm font-medium text-gray-900 truncate">{entry.look.name}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ml-2 flex-shrink-0 ${entry.look.active ? "bg-gray-900" : "bg-gray-300"}`} />
              </div>
            </button>
          ))}
          {looks.length === 0 && <p className="text-xs text-gray-300 pt-6">Aucun look</p>}
        </div>
      </div>

      {/* ── Panel droit */}
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
              <button onClick={() => setConfirm({ type: "look", id: selected._id, label: selected.name })}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div className="px-10 py-8 flex flex-col gap-10">

            {/* Infos */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6">Informations</p>
              <div className="flex flex-col gap-6 max-w-xl">
                <div>
                  <label className={labelCls}>Nom du look</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className={inputCls} placeholder="ex: Look 1" />
                </div>
                <div>
                  <label className={labelCls}>Description éditoriale</label>
                  <textarea value={form.description} rows={4}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Costume confectionné dans un tissu en laine..."
                    className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            {/* Photos éditoriales (face + dos) */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Photos éditoriales du look</p>
              <p className="text-[11px] text-gray-400 mb-6">Les photos de face et de dos affichées à gauche sur la page du look</p>
              <div className="flex gap-4 mb-4">
                {photos.map((photo, i) => (
                  <div key={photo._id} className="relative group overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: 120, aspectRatio: "3/4" }}>
                    <img src={mediaSrc(photo.imageUrl)} alt={`photo-${i}`} className="w-full h-full object-cover object-top" />
                    <div className="absolute top-1 left-2 text-white text-[10px] opacity-40 font-medium">
                      {i === 0 ? "Face" : i === 1 ? "Dos" : i + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button onClick={() => setConfirm({ type: "photo", id: photo._id, label: "cette photo" })}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-white border border-white px-2 py-1 hover:bg-white hover:text-black transition-all">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                {/* Slot vide si < 2 photos */}
                {photos.length === 0 && (
                  <div className="flex gap-4">
                    {["Face", "Dos"].map(l => (
                      <div key={l} className="bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-[10px] tracking-widest flex-shrink-0"
                        style={{ width: 120, aspectRatio: "3/4" }}>{l}</div>
                    ))}
                  </div>
                )}
              </div>
              <UploadBtn onFile={addPhoto} label="+ Ajouter une photo" loading={loading.photo} />
            </section>

            {/* Articles du look (produit + photo éditoriale) */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Articles du look</p>
              <p className="text-[11px] text-gray-400 mb-6">Pour chaque article, choisissez le produit et uploadez la photo du produit à afficher</p>

              {/* Items existants */}
              {items.length > 0 && (
                <div className="flex flex-col gap-3 mb-8">
                  {items.map((item, i) => {
                    const product = products.find(p => String(p._id) === String(item.productId));
                    return (
                      <div key={item._id} className="flex items-center gap-5 p-4 border border-gray-100">
                        {/* Photo du produit */}
                        <div className="relative group flex-shrink-0 bg-gray-100 overflow-hidden" style={{ width: 72, height: 96 }}>
                          {item.imageUrl ? (
                            <img src={mediaSrc(item.imageUrl)} alt="" className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">Photo</div>
                          )}
                          {/* Overlay changer photo */}
                          <label className="absolute inset-0 bg-black/0 group-hover:bg-black/40 cursor-pointer flex items-center justify-center transition-all">
                            <span className="opacity-0 group-hover:opacity-100 text-white text-[9px] tracking-wider text-center leading-tight">Changer</span>
                            <input type="file" accept="image/*" hidden
                              onChange={e => e.target.files[0] && uploadItemImage(item._id, e.target.files[0])} />
                          </label>
                        </div>
                        {/* Infos produit */}
                        <div className="flex-1 min-w-0">
                          {product ? (
                            <>
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.price} TND</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400 italic">Produit non trouvé (ID: {item.productId})</p>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-300">#{i + 1}</span>
                        {/* Supprimer */}
                        <button onClick={() => setConfirm({ type: "item", id: item._id, label: `l'article ${product?.name || ""}` })}
                          className="text-gray-300 hover:text-red-400 transition-colors p-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formulaire nouvel article */}
              <div className="border border-dashed border-gray-200 p-5 flex flex-col gap-4">
                <p className="text-[10px] tracking-widest uppercase text-gray-400">Ajouter un article</p>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Produit</label>
                    <select value={newItemProductId} onChange={e => setNewItemProductId(e.target.value)}
                      className={inputCls}>
                      <option value="">— Choisir un produit —</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Photo du produit dans le look</label>
                    <div className="flex items-center gap-3 mt-1">
                      {newItemFile ? (
                        <div className="flex items-center gap-2">
                          <img src={URL.createObjectURL(newItemFile)} alt="" className="w-12 h-16 object-cover bg-gray-100" />
                          <button onClick={() => setNewItemFile(null)} className="text-[10px] text-gray-400 hover:text-black">✕</button>
                        </div>
                      ) : (
                        <label className="text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 px-4 py-2.5 hover:border-black hover:text-black transition-colors cursor-pointer whitespace-nowrap">
                          Choisir une image
                          <input type="file" accept="image/*" hidden
                            onChange={e => e.target.files[0] && setNewItemFile(e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={addItem} disabled={loading.item}
                  className="self-start text-[10px] tracking-widest uppercase border border-gray-900 text-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                  {loading.item ? "…" : "+ Ajouter"}
                </button>
              </div>
            </section>

          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs tracking-widest uppercase text-gray-300">Sélectionnez un look</p>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <form onSubmit={createLook} className="bg-white w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Nouveau</p>
              <h2 className="text-lg font-medium text-gray-900">Look</h2>
            </div>
            <div>
              <label className={labelCls}>Nom *</label>
              <input value={createName} onChange={e => setCreateName(e.target.value)}
                required placeholder="ex: Look 1" className={inputCls} />
            </div>
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
            if (confirm.type === "look") deleteLook(confirm.id);
            else if (confirm.type === "photo") deletePhoto(confirm.id);
            else if (confirm.type === "item") deleteItem(confirm.id);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Lookbook;
