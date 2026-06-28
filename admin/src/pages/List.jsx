import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { backendUrl } from "../App";
const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["Men", "Women"];
const SUB_CATEGORIES = ["Shirts","T-shirts","Pants","Jeans","Shorts","Skirts","Dress","Tank Top","Jackets","Accessories","Sweater"];

const imgSrc = (img) =>
  img ? (img.startsWith("http") ? img : `${backendUrl}${img}`) : "";

// ─── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ product, token, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    composition: product.composition || "",
    price: product.price || "",
    salePrice: product.salePrice || "",
    category: product.category || "Women",
    subCategory: product.subCategory || "Dress",
    bestseller: product.bestseller || false,
    sizes: product.sizes || {},
    color: product.color || "#000000",
    colorGroup: product.colorGroup || "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleSize = (s) => {
    const next = { ...form.sizes };
    if (next[s] !== undefined) delete next[s]; else next[s] = 0;
    set("sizes", next);
  };

  const setStock = (s, v) =>
    set("sizes", { ...form.sizes, [s]: Math.max(0, parseInt(v) || 0) });

  const save = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/product/update/${product._id}`,
        {
          name: form.name,
          description: form.description,
          composition: form.composition,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          category: form.category,
          subCategory: form.subCategory,
          bestseller: form.bestseller,
          sizes: form.sizes,
          color: form.color,
          colorGroup: form.colorGroup || null,
        },
        { headers: { token } }
      );
      if (data.success) { toast.success("Produit mis à jour"); onSaved(); onClose(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur réseau"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Modifier le produit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl leading-none">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Nom */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">NOM</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">DESCRIPTION</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>

          {/* Composition */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">COMPOSITION</label>
            <textarea value={form.composition} onChange={(e) => set("composition", e.target.value)}
              rows={2}
              placeholder="ex: 100% coton"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black resize-none" />
          </div>

          {/* Prix + Solde */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">PRIX (TND)</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">PRIX SOLDÉ <span className="font-normal text-gray-400">(optionnel)</span></label>
              <input type="number" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)}
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              {form.salePrice && form.price && Number(form.salePrice) < Number(form.price) && (
                <p className="text-xs text-orange-500 mt-1">
                  -{Math.round((1 - Number(form.salePrice) / Number(form.price)) * 100)}% de remise
                </p>
              )}
            </div>
          </div>

          {/* Catégorie + Sous-catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">CATÉGORIE</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">SOUS-CATÉGORIE</label>
              <select value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black">
                {SUB_CATEGORIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Tailles & Stock */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">TAILLES & STOCK</label>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <button type="button" onClick={() => toggleSize(s)}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                      form.sizes[s] !== undefined
                        ? "bg-black text-white border-black"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>
                    {s}
                  </button>
                  {form.sizes[s] !== undefined && (
                    <input type="number" min="0" value={form.sizes[s]}
                      onChange={(e) => setStock(s, e.target.value)}
                      className="w-14 border border-gray-200 rounded-md text-center text-xs py-1 focus:outline-none focus:border-black" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Couleur + Groupe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">COULEUR</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
                  className="w-10 h-10 rounded-md cursor-pointer border border-gray-300" />
                <span className="text-sm text-gray-500 font-mono">{form.color}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-2 block">GROUPE VARIANTES COULEUR</label>
              <input value={form.colorGroup} onChange={(e) => set("colorGroup", e.target.value)}
                placeholder="ex: robe-mini-basic"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Mettez le <strong>même texte</strong> sur tous les produits qui sont des variantes couleur d'un même article. Ils s'afficheront avec des pastilles couleur dans la boutique.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button onClick={onClose}
            className="px-5 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            Annuler
          </button>
          <button onClick={save}
            className="px-5 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── List Page ─────────────────────────────────────────────────────────────────
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchList = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setList(data.products);
    } catch { toast.error("Erreur chargement"); }
  };

  const removeProduct = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      if (data.success) { toast.success("Produit supprimé"); fetchList(); }
      else toast.error(data.message);
    } catch { toast.error("Erreur réseau"); }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="pt-8 px-10 max-w-5xl">
      {editing && (
        <EditModal
          product={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={fetchList}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Catalogue</p>
          <p className="text-sm text-gray-900">{list.length} produit{list.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Colonne headers */}
      <div className="grid grid-cols-[56px_1fr_90px_140px_120px_120px] gap-4 items-center border-b border-gray-100 pb-3 mb-1">
        {["", "Nom", "Catégorie", "Prix", "Couleur", ""].map((h, i) => (
          <p key={i} className={`text-[9px] tracking-widest uppercase text-gray-300 ${i === 5 ? "text-right" : ""}`}>{h}</p>
        ))}
      </div>

      {/* Lignes */}
      <div className="flex flex-col">
        {list.length > 0 ? list.map((item) => {
          const isOnSale = item.salePrice && item.salePrice > 0;
          const discount = isOnSale ? Math.round((1 - item.salePrice / item.price) * 100) : 0;
          return (
            <div key={item._id}
              className="grid grid-cols-[56px_1fr_90px_140px_120px_120px] gap-4 items-center border-b border-gray-100 py-4 hover:bg-gray-50/40 transition-colors group">

              {/* Image */}
              <img
                src={imgSrc(item.images?.[0])}
                alt={item.name}
                className="w-14 h-16 object-cover object-top bg-gray-50"
              />

              {/* Nom */}
              <div>
                <p className="text-sm text-gray-900">{item.name}</p>
                <p className="text-[10px] tracking-widest uppercase text-gray-300 mt-0.5">{item.subCategory}</p>
              </div>

              {/* Catégorie */}
              <p className="text-[11px] tracking-widest uppercase text-gray-400">{item.category}</p>

              {/* Prix */}
              <div className="whitespace-nowrap">
                {isOnSale ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{item.salePrice} TND</span>
                    <span className="text-[10px] text-gray-300 line-through">{item.price}</span>
                    <span className="text-[9px] tracking-widest text-gray-400">-{discount}%</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-900">{item.price} TND</span>
                )}
              </div>

              {/* Couleur / groupe */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: item.color || "#000" }}
                />
                {item.colorGroup ? (
                  <span className="text-[10px] tracking-widest uppercase text-gray-400 truncate">{item.colorGroup}</span>
                ) : (
                  <span className="text-gray-200 text-xs">—</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setEditing(item)}
                  className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-gray-400"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setConfirmId(item._id)}
                  className="text-[10px] tracking-widest uppercase text-gray-300 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        }) : (
          <p className="text-sm text-gray-300 py-12 text-center">Aucun produit.</p>
        )}
      </div>

      {confirmId && (
        <ConfirmModal
          message="Supprimer ce produit ?"
          onConfirm={() => { removeProduct(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default List;
