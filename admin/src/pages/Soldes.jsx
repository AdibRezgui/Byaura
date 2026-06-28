import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { backendUrl } from "../App";

const inputCls = "w-full border-b border-gray-200 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder:text-gray-300";
const labelCls = "text-[10px] tracking-widest text-gray-400 uppercase block mb-1";

const imgSrc = (url) =>
  url ? (url.startsWith("http") ? url : `${backendUrl}${url}`) : null;

const Soldes = ({ token }) => {
  const [sales, setSales] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saleProducts, setSaleProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "", active: false });
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  const setLoad = (k, v) => setLoading(p => ({ ...p, [k]: v }));

  const fetchAll = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/sale/all`, { headers: { token } });
      if (data.success) setSales(data.sales);
    } catch { toast.error("Erreur chargement soldes"); }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) setAllProducts(data.products || []);
    } catch {}
  };

  const fetchSaleProducts = async (saleId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/sale/${saleId}/products`, { headers: { token } });
      if (data.success) setSaleProducts(data.products || []);
    } catch {}
  };

  useEffect(() => { fetchAll(); fetchAllProducts(); }, []);

  const selectSale = (sale) => {
    setSelected(sale);
    setForm({ name: sale.name, startDate: sale.startDate || "", endDate: sale.endDate || "", active: sale.active });
    fetchSaleProducts(sale.id);
    setProductSearch("");
  };

  const createSale = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) return toast.error("Nom requis");
    setLoad("create", true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/sale/create`, createForm, { headers: { token } });
      if (data.success) {
        toast.success("Solde créé");
        setShowCreate(false);
        setCreateForm({ name: "", startDate: "", endDate: "" });
        await fetchAll();
        selectSale(data.sale);
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("create", false); }
  };

  const saveSale = async () => {
    setLoad("save", true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/sale/${selected.id}`, form, { headers: { token } });
      if (data.success) {
        toast.success("Sauvegardé");
        setSelected(data.sale);
        fetchAll();
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    finally { setLoad("save", false); }
  };

  const deleteSale = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/sale/${id}`, { headers: { token } });
      if (data.success) {
        toast.success("Solde supprimé");
        if (selected?.id === id) { setSelected(null); setSaleProducts([]); }
        fetchAll();
      } else toast.error(data.message);
    } catch { toast.error("Erreur"); }
    setConfirm(null);
  };

  const addProduct = async (productId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/sale/${selected.id}/product/${productId}`, {}, { headers: { token } });
      if (data.success) { await fetchSaleProducts(selected.id); toast.success("Produit ajouté"); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
  };

  const removeProduct = async (productId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/sale/${selected.id}/product/${productId}`, { headers: { token } });
      if (data.success) { await fetchSaleProducts(selected.id); toast.success("Produit retiré"); }
      else toast.error(data.message);
    } catch { toast.error("Erreur"); }
  };

  const saleProductIds = new Set(saleProducts.map(p => String(p._id || p.id)));

  const filteredAll = allProducts.filter(p =>
    !saleProductIds.has(String(p._id || p.id)) &&
    (p.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">

      {/* ── Liste gauche ─────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 pt-8 px-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] tracking-widest uppercase text-gray-400">Soldes</span>
          <button onClick={() => setShowCreate(true)}
            className="text-[10px] tracking-widest uppercase border-b border-black pb-px hover:opacity-50 transition-opacity">
            + Nouveau
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {sales.map((sale) => (
            <button key={sale.id} onClick={() => selectSale(sale)}
              className={`text-left px-4 py-3 border border-gray-100 rounded-xl transition-all ${selected?.id === sale.id ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50"}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${selected?.id === sale.id ? "text-white" : "text-gray-900"}`}>{sale.name}</p>
                  {sale.startDate && (
                    <p className={`text-[10px] mt-0.5 ${selected?.id === sale.id ? "text-white/50" : "text-gray-400"}`}>
                      {new Date(sale.startDate).toLocaleDateString("fr-FR")}
                      {sale.endDate && ` → ${new Date(sale.endDate).toLocaleDateString("fr-FR")}`}
                    </p>
                  )}
                </div>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sale.active ? "bg-green-400" : selected?.id === sale.id ? "bg-white/30" : "bg-gray-200"}`} />
              </div>
            </button>
          ))}
          {sales.length === 0 && <p className="text-xs text-gray-300 pt-4">Aucun solde créé.</p>}
        </div>
      </div>

      {/* ── Panel droit ──────────────────────────────────────── */}
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
              <button onClick={saveSale} disabled={loading.save}
                className="text-xs tracking-widest uppercase border border-gray-900 text-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                {loading.save ? "…" : "Sauvegarder"}
              </button>
              <button onClick={() => setConfirm({ id: selected.id, label: selected.name })}
                className="text-xs text-gray-300 hover:text-red-400 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div className="px-10 py-8 flex flex-col gap-10">

            {/* Infos */}
            <section>
              <p className={labelCls}>Informations</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                <div>
                  <p className={labelCls}>Nom</p>
                  <input className={inputCls} value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Soldes Été 2026" />
                </div>
                <div>
                  <p className={labelCls}>Date de début</p>
                  <input type="date" className={inputCls} value={form.startDate}
                    onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <p className={labelCls}>Date de fin</p>
                  <input type="date" className={inputCls} value={form.endDate}
                    onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>
            </section>

            {/* Produits dans la sélection */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <p className={labelCls}>Produits dans ce solde ({saleProducts.length})</p>
              </div>
              {saleProducts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {saleProducts.map((p) => (
                    <div key={p._id || p.id}
                      className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        {(p.images?.[0] || p.image) && (
                          <img
                            src={imgSrc(Array.isArray(p.images) ? p.images[0] : p.image)}
                            alt={p.name}
                            className="w-12 h-14 object-cover object-top bg-gray-100 rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-400">{p.price} TND</p>
                            {p.salePrice > 0 && (
                              <p className="text-xs text-red-500 font-medium">{p.salePrice} TND</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeProduct(p._id || p.id)}
                        className="text-xs text-gray-300 hover:text-red-400 transition-colors p-2">
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 py-4">Aucun produit dans ce solde.</p>
              )}
            </section>

            {/* Ajouter des produits */}
            <section>
              <p className={labelCls}>Ajouter des produits</p>
              <input
                type="text"
                placeholder="Rechercher un produit…"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className={`${inputCls} mb-4`}
              />
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredAll.map((p) => (
                  <div key={p._id || p.id}
                    className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      {(p.images?.[0] || p.image) && (
                        <img
                          src={imgSrc(Array.isArray(p.images) ? p.images[0] : p.image)}
                          alt={p.name}
                          className="w-10 h-12 object-cover object-top bg-gray-100 rounded"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-900">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-gray-400">{p.price} TND</p>
                          {p.salePrice > 0 && (
                            <p className="text-xs text-red-500">{p.salePrice} TND</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => addProduct(p._id || p.id)}
                      className="text-[10px] tracking-widest uppercase border-b border-gray-400 text-gray-400 hover:text-black hover:border-black transition-colors">
                      + Ajouter
                    </button>
                  </div>
                ))}
                {filteredAll.length === 0 && (
                  <p className="text-xs text-gray-300 py-2">
                    {productSearch ? "Aucun résultat." : "Tous les produits sont déjà dans ce solde."}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-300">
          <p className="text-sm tracking-widest uppercase">Sélectionnez ou créez un solde</p>
        </div>
      )}

      {/* Modal création */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <form onSubmit={createSale} className="bg-white w-full max-w-md p-8 flex flex-col gap-6">
            <p className="text-[10px] tracking-widest uppercase text-gray-400">Nouveau solde</p>
            <div>
              <p className={labelCls}>Nom *</p>
              <input required autoFocus className={inputCls} placeholder="Soldes Été 2026"
                value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>Début</p>
                <input type="date" className={inputCls}
                  value={createForm.startDate} onChange={e => setCreateForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <p className={labelCls}>Fin</p>
                <input type="date" className={inputCls}
                  value={createForm.endDate} onChange={e => setCreateForm(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-gray-400 hover:text-black transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading.create}
                className="text-xs tracking-widest uppercase border border-gray-900 text-gray-900 px-6 py-2 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-40">
                {loading.create ? "…" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={`Supprimer le solde "${confirm.label}" ?`}
          onConfirm={() => deleteSale(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Soldes;
