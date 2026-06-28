import React, { useState, useCallback } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

const inputCls = "w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white";
const labelCls = "text-[10px] tracking-widest text-gray-500 uppercase block mb-1.5";

const ImageSlot = ({ file, onChange, label }) => {
  const [preview, setPreview] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    onChange(f);
  };

  return (
    <label className="cursor-pointer block">
      <div className={`w-20 h-24 border border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 hover:border-gray-400 transition-colors relative group`}>
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-6 h-6 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
        )}
      </div>
      <p className="text-[9px] text-gray-400 text-center mt-1">{label}</p>
      <input type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files[0])} />
    </label>
  );
};

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [composition, setComposition] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("Women");
  const [subCategory, setSubCategory] = useState("Shirts");
  const [color, setColor] = useState("#000000");
  const [colorGroup, setColorGroup] = useState("");
  const [sizes, setSizes] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setImage = (idx, file) => {
    setImages(prev => { const n = [...prev]; n[idx] = file; return n; });
  };

  const toggleSize = (size) => {
    setSizes(prev => {
      const n = { ...prev };
      n[size] !== undefined ? delete n[size] : (n[size] = 0);
      return n;
    });
  };

  const setStock = (size, val) => {
    setSizes(prev => ({ ...prev, [size]: Math.max(0, parseInt(val) || 0) }));
  };

  const reset = () => {
    setImages([null, null, null, null]);
    setName(""); setDescription(""); setComposition(""); setPrice("");
    setSalePrice(""); setCategory("Women"); setSubCategory("Shirts");
    setColor("#000000"); setColorGroup(""); setSizes({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation explicite
    if (!name.trim()) return toast.error("Le nom du produit est requis");
    if (!price || isNaN(price) || Number(price) <= 0) return toast.error("Le prix est requis");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("description", description);
      fd.append("composition", composition);
      fd.append("price", price);
      fd.append("category", category);
      fd.append("subCategory", subCategory);
      fd.append("sizes", JSON.stringify(sizes));
      if (salePrice && Number(salePrice) > 0) fd.append("salePrice", salePrice);
      fd.append("color", color);
      if (colorGroup.trim()) fd.append("colorGroup", colorGroup.trim());
      images.forEach(f => { if (f) fd.append("images", f); });

      const { data } = await axios.post(`${backendUrl}/api/product/add`, fd, { headers: { token } });

      if (data.success) {
        toast.success("Produit ajouté");
        reset();
      } else {
        toast.error(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const discountPct = salePrice && price && Number(salePrice) < Number(price)
    ? Math.round((1 - Number(salePrice) / Number(price)) * 100) : null;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7 max-w-2xl pb-16">

      {/* Images */}
      <div>
        <p className={labelCls}>Photos du produit</p>
        <div className="flex gap-3">
          {[0, 1, 2, 3].map(i => (
            <ImageSlot key={i} file={images[i]}
              onChange={f => setImage(i, f)}
              label={i === 0 ? "Principal" : `Photo ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Nom */}
      <div>
        <label className={labelCls}>Nom du produit *</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="ex: Robe Lin Bleu"
          className={inputCls} />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea value={description} rows={3}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description éditoriale du produit..."
          className={`${inputCls} resize-none`} />
      </div>

      {/* Composition */}
      <div>
        <label className={labelCls}>Composition</label>
        <textarea value={composition} rows={2}
          onChange={e => setComposition(e.target.value)}
          placeholder="ex: 100% Lin, 80% Polyester 20% Élasthanne..."
          className={`${inputCls} resize-none`} />
      </div>

      {/* Catégories */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Catégorie</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Sous-catégorie</label>
          <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className={inputCls}>
            {["Shirts","T-shirts","Pants","Jeans","Shorts","Skirts","Dress","Tank Top","Jackets","Accessories","Sweater"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prix */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Prix (TND) *</label>
          <input type="number" min="0" step="0.01" value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="ex: 150" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            Prix soldé (TND)
            {discountPct && <span className="ml-2 text-red-400 normal-case tracking-normal">-{discountPct}%</span>}
          </label>
          <input type="number" min="0" step="0.01" value={salePrice}
            onChange={e => setSalePrice(e.target.value)}
            placeholder="Optionnel" className={`${inputCls} border-orange-200 focus:border-orange-400`} />
        </div>
      </div>

      {/* Tailles & stock */}
      <div>
        <label className={labelCls}>Tailles & stock</label>
        <div className="flex flex-wrap gap-3">
          {SIZES.map(size => (
            <div key={size} className="flex flex-col items-center gap-1.5">
              <button type="button" onClick={() => toggleSize(size)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  sizes[size] !== undefined
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}>
                {size}
              </button>
              {sizes[size] !== undefined && (
                <input type="number" min="0" value={sizes[size]}
                  onChange={e => setStock(size, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="w-14 text-center text-xs border border-gray-200 px-1 py-1 focus:outline-none focus:border-gray-400" />
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Cliquez pour activer, saisissez le stock.</p>
      </div>

      {/* Couleur & variantes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Couleur</label>
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-9 h-9 cursor-pointer border border-gray-200 bg-white p-0.5" />
            <span className="text-xs text-gray-400 font-mono">{color}</span>
          </div>
        </div>
        <div>
          <label className={labelCls}>Groupe de variantes <span className="normal-case tracking-normal text-gray-400">(optionnel)</span></label>
          <input value={colorGroup} onChange={e => setColorGroup(e.target.value)}
            placeholder="ex: robe-mini-basic" className={inputCls} />
          <p className="text-[10px] text-gray-400 mt-1">Même ID = variantes couleur</p>
        </div>
      </div>

{/* Bouton */}
      <button type="submit" disabled={submitting}
        className="self-start px-10 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-40">
        {submitting ? "Ajout en cours…" : "Ajouter le produit"}
      </button>

    </form>
  );
};

export default Add;
