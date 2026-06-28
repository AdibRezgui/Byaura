import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

import { backendUrl } from "../App";
const mediaSrc = (url) => url ? (url.startsWith("http") ? url : `${backendUrl}${url}`) : null;

const inputCls = "w-full border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder:text-gray-300";
const labelCls = "text-[10px] tracking-widest text-gray-400 uppercase block mb-1";

const PopUps = ({ token }) => {
  const [popups, setPopups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ name: "", place: "", date: "", description: "", active: false });
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [loading, setLoading] = useState({});
  const [confirm, setConfirm] = useState(null);
  const photoRef = useRef();

  const setLoad = (k, v) => setLoading(p => ({ ...p, [k]: v }));

  const fetchAll = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/popups/admin/all`, { headers: { token } });
      if (data.success) setPopups(data.popups);
    } catch { toast.error("Erreur chargement pop-ups"); }
  };

  useEffect(() => { fetchAll(); }, []);

  const selectPopup = (entry) => {
    const p = entry.popup;
    setSelected(p);
    setPhotos(entry.photos || []);
    setForm({ name: p.name || "", place: p.place || "", date: p.date || "", description: p.description || "", active: p.active });
  };

  const createPopup = async (e) => {
    e.preventDefault();
    setLoad("create", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/popups/create`, { name: createName }, { headers: { token } });
      if (data.success) {
        toast.success("Pop-up créé");
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
      const { data } = await axios.put(`${backendUrl}/api/popups/${selected._id}`, { ...form }, { headers: { token } });
      if (data.success) { toast.success("Sauvegardé"); fetchAll(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("save", false); }
  };

  const addPhoto = async (file) => {
    setLoad("photo", true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await axios.post(`${backendUrl}/api/popups/${selected._id}/photo`, fd, { headers: { token } });
      if (data.success) { setPhotos(p => [...p, data.photo]); toast.success("Photo ajoutée"); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("photo", false); }
  };

  const deletePhoto = async (photoId) => {
    try {
      await axios.delete(`${backendUrl}/api/popups/photo/${photoId}`, { headers: { token } });
      setPhotos(p => p.filter(x => x._id !== photoId));
      toast.success("Photo supprimée");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const deletePopup = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/popups/${id}`, { headers: { token } });
      if (data.success) {
        toast.success("Pop-up supprimé");
        if (selected?._id === id) setSelected(null);
        await fetchAll();
      } else toast.error(data.message || "Erreur lors de la suppression");
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Liste gauche */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 pt-8 px-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Pop ups</span>
          <button onClick={() => setShowCreate(true)}
            className="text-[10px] tracking-widest uppercase border-b border-black pb-px hover:opacity-50 transition-opacity">
            + Nouveau
          </button>
        </div>
        <div className="flex flex-col">
          {popups.map((entry) => (
            <button key={entry.popup._id} onClick={() => selectPopup(entry)}
              className={`text-left py-4 border-b border-gray-100 transition-all ${selected?._id === entry.popup._id ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {entry.photos?.[0] && (
                    <img src={mediaSrc(entry.photos[0].imageUrl)} alt=""
                      className="w-10 h-10 object-cover flex-shrink-0 bg-gray-100" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{entry.popup.name}</p>
                    {entry.popup.place && <p className="text-[10px] text-gray-400 truncate">{entry.popup.place}</p>}
                  </div>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.popup.active ? "bg-gray-900" : "bg-gray-200"}`} />
              </div>
            </button>
          ))}
          {popups.length === 0 && <p className="text-xs text-gray-300 pt-6">Aucun pop-up</p>}
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
              {/* Toggle actif */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setForm(p => ({ ...p, active: !p.active }))}>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${form.active ? "bg-gray-900" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-gray-500">{form.active ? "Visible" : "Masqué"}</span>
              </div>
              <button onClick={saveEdit} disabled={loading.save}
                className="text-xs tracking-widest uppercase border border-gray-900 text-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                {loading.save ? "…" : "Sauvegarder"}
              </button>
              <button onClick={() => setConfirm({ id: selected._id, label: selected.name })}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div className="px-10 py-8 flex flex-col gap-10">

            {/* Infos */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6">Informations</p>
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="col-span-2">
                  <label className={labelCls}>Nom *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className={inputCls} placeholder="ex: Madrid, Plaza del Callao" />
                </div>
                <div>
                  <label className={labelCls}>Lieu / Ville</label>
                  <input value={form.place} onChange={e => setForm(p => ({ ...p, place: e.target.value }))}
                    className={inputCls} placeholder="ex: Spain" />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className={inputCls} placeholder="ex: 30 mai – 15 juin 2026" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} rows={5}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Présentation du pop-up, horaires, informations pratiques..."
                    className={`${inputCls} resize-none`} />
                </div>
              </div>
            </section>

            {/* Photos */}
            <section>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Photos</p>
              <p className="text-[11px] text-gray-400 mb-6">
                La première photo sera utilisée comme fond d'écran principal
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {photos.map((photo, i) => (
                  <div key={photo._id} className="relative group overflow-hidden bg-gray-100 flex-shrink-0"
                    style={{ width: 140, height: 100 }}>
                    <img src={mediaSrc(photo.imageUrl)} alt={`photo-${i}`}
                      className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-2 text-white text-[9px] tracking-widest uppercase opacity-60">
                        Principal
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button onClick={() => setConfirm({ photoId: photo._id, label: "cette photo" })}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-white border border-white px-2 py-1 hover:bg-white hover:text-black transition-all">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <label className="inline-flex cursor-pointer text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 px-4 py-2.5 hover:border-black hover:text-black transition-colors">
                {loading.photo ? "…" : "+ Ajouter une photo"}
                <input type="file" accept="image/*" hidden ref={photoRef}
                  onChange={e => e.target.files[0] && addPhoto(e.target.files[0])} />
              </label>
            </section>

          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs tracking-widest uppercase text-gray-300">Sélectionnez un pop-up</p>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <form onSubmit={createPopup} className="bg-white w-full max-w-sm p-8 flex flex-col gap-6 shadow-2xl">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Nouveau</p>
              <h2 className="text-lg font-medium text-gray-900">Pop-up</h2>
            </div>
            <div>
              <label className={labelCls}>Nom *</label>
              <input value={createName} onChange={e => setCreateName(e.target.value)}
                required placeholder="ex: Tunis, Lac Berges" className={inputCls} />
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
            if (confirm.photoId) deletePhoto(confirm.photoId);
            else deletePopup(confirm.id);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default PopUps;
