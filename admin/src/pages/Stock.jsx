import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const sizeInputClass = (qty) => {
  if (qty === 0) return 'border-red-200 text-red-400';
  if (qty < 5)  return 'border-amber-200 text-amber-500';
  return              'border-gray-200 text-gray-700';
};

const Stock = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/product/list');
      if (data.success) setProducts(data.products);
    } catch {
      toast.error('Erreur chargement produits');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleQtyChange = (productId, size, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setEdits((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [size]: qty },
    }));
  };

  const saveStock = async (product) => {
    const updatedSizes = { ...product.sizes, ...(edits[product._id] || {}) };
    setSaving((prev) => ({ ...prev, [product._id]: true }));
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/product/${product._id}/stock`,
        updatedSizes,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(`Stock de "${product.name}" mis à jour`);
        setEdits((prev) => { const n = { ...prev }; delete n[product._id]; return n; });
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = (sizes) => Object.values(sizes || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="pt-8 px-10 max-w-5xl">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Stock</p>
          <p className="text-sm text-gray-900">
            {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white w-52"
        />
      </div>

      {/* En-têtes colonnes */}
      <div className="grid grid-cols-[56px_200px_1fr_80px] gap-6 items-center border-b border-gray-100 pb-3 mb-1">
        {['', 'Article', 'Tailles', ''].map((h, i) => (
          <p key={i} className="text-[9px] tracking-widest uppercase text-gray-300">{h}</p>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col">
        {filteredProducts.length === 0 && (
          <p className="text-sm text-gray-300 py-12 text-center">Aucun article trouvé.</p>
        )}

        {filteredProducts.map((product) => {
          const currentSizes = { ...product.sizes, ...(edits[product._id] || {}) };
          const total = totalStock(currentSizes);
          const isDirty = !!edits[product._id];

          return (
            <div
              key={product._id}
              className="grid grid-cols-[56px_200px_1fr_80px] gap-6 items-center border-b border-gray-100 py-4 hover:bg-gray-50/40 transition-colors"
            >
              {/* Image */}
              <img
                src={product.images?.[0] || ''}
                alt={product.name}
                className="w-14 h-16 object-cover object-top bg-gray-50"
              />

              {/* Nom + total */}
              <div>
                <p className="text-sm text-gray-900 leading-tight">{product.name}</p>
                <p className="text-[10px] tracking-widest uppercase mt-1">
                  <span className="text-gray-300">Total · </span>
                  <span className={
                    total === 0 ? 'text-red-400' : total < 10 ? 'text-amber-500' : 'text-gray-500'
                  }>
                    {total}
                  </span>
                </p>
              </div>

              {/* Tailles */}
              <div className="flex flex-wrap gap-3">
                {Object.entries(currentSizes).map(([size, qty]) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] tracking-widest uppercase text-gray-300">{size}</span>
                    <input
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) => handleQtyChange(product._id, size, e.target.value)}
                      className={`w-12 text-center text-xs border px-1 py-1 focus:outline-none focus:border-gray-400 transition-colors bg-white font-medium ${sizeInputClass(qty)}`}
                    />
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex justify-end">
                {isDirty && (
                  <button
                    onClick={() => saveStock(product)}
                    disabled={saving[product._id]}
                    className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-gray-400 disabled:opacity-40 disabled:cursor-wait"
                  >
                    {saving[product._id] ? '...' : 'Sauvegarder'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stock;
