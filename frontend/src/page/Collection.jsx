import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch, activeSale, saleProducts } = useContext(ShopContext);
  const productsSafe = products || [];
  const location = useLocation();
  const navigate = useNavigate();

  const soldesParam = new URLSearchParams(location.search).get("soldes") === "1";
  const [showSoldes, setShowSoldes] = useState(soldesParam);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(productsSafe);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sort, setSort] = useState("relevant");

  // Sync URL param → tab state
  useEffect(() => {
    setShowSoldes(new URLSearchParams(location.search).get("soldes") === "1");
  }, [location.search]);

  const toggleCategory = (e) => {
    const value = (e.target.value || "").toLowerCase();
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = (e.target.value || "").toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = [...productsSafe];

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(((item.category || "") + "").toLowerCase())
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(((item.subCategory || "") + "").toLowerCase())
      );
    }

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "low-high") {
      productsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "high-low") {
      productsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    setFilterProducts(productsSafe);
  }, [productsSafe]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sort, search, showSearch]);

  const labelize = (str) =>
    str
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const subTypes = [
    "shirts",
    "t-shirts",
    "pants",
    "jeans",
    "shorts",
    "skirts",
    "dress",
    "tank top",
    "jackets",
    "accessories",
    "sweater",
  ];

  const displayProducts = showSoldes ? saleProducts : filterProducts;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  };

  return (
    <div>
      {/* ── Navigation ───────────────────────────────────────── */}
      <div className="flex items-center gap-8 pt-8 border-b border-gray-200">
        <button
          onClick={() => { setShowSoldes(false); navigate("/collection"); }}
          className={`pb-3 text-[10px] tracking-[0.35em] uppercase transition-colors border-b-2 -mb-px ${
            !showSoldes ? "border-gray-900 text-gray-900" : "border-transparent text-gray-300 hover:text-gray-500"
          }`}
        >
          Tout
        </button>
        {activeSale && (
          <button
            onClick={() => { setShowSoldes(true); navigate("/collection?soldes=1"); }}
            className={`pb-3 text-[10px] tracking-[0.35em] uppercase transition-colors border-b-2 -mb-px ${
              showSoldes ? "border-gray-900 text-gray-900" : "border-transparent text-gray-300 hover:text-gray-500"
            }`}
          >
            {activeSale.name}
          </button>
        )}
      </div>

      {showSoldes && activeSale ? (
        /* ── Vue soldés ─────────────────────────────────────────── */
        <div>
          <div className="flex items-center justify-between pt-8 mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
              {activeSale.name}
              {activeSale.endDate && (
                <span className="text-gray-300 ml-3">· jusqu'au {formatDate(activeSale.endDate)}</span>
              )}
            </p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
              {saleProducts.length} article{saleProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {saleProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10 pt-8">
              {saleProducts.map((item) => (
                <div key={item._id} className="relative">
                  <ProductItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    salePrice={item.salePrice}
                    sizes={item.sizes}
                    color={item.color}
                    colorGroup={item.colorGroup}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400">
                Aucun article soldé pour le moment.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ── Vue normale ─────────────────────────────────────────── */
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-12 pt-8">

          {/* ── Filtres ─────────────────────────────────────────────── */}
          <div className="w-full sm:w-52 flex-shrink-0">
            <button
              className="sm:hidden flex items-center justify-between w-full py-3 text-xs tracking-[0.2em] uppercase text-gray-500 border-b border-gray-200 mb-4"
              onClick={() => setShowFilter((s) => !s)}
            >
              Filtres
              <svg className={`w-3 h-3 transition-transform ${showFilter ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`${showFilter ? "flex" : "hidden"} sm:flex flex-col gap-8`}>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">Catégories</p>
                <div className="flex flex-col gap-3">
                  {["men", "women"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <span
                        onClick={() => {
                          setCategory((prev) =>
                            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                          category.includes(cat) ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-500"
                        }`}
                      >
                        {category.includes(cat) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span
                        onClick={() => {
                          setCategory((prev) =>
                            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className="text-xs tracking-widest uppercase text-gray-600 cursor-pointer"
                      >
                        {cat === "men" ? "Homme" : "Femme"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-4">Type</p>
                <div className="flex flex-col gap-3">
                  {subTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <span
                        onClick={() => {
                          setSubCategory((prev) =>
                            prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
                          );
                        }}
                        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                          subCategory.includes(type) ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-500"
                        }`}
                      >
                        {subCategory.includes(type) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span
                        onClick={() => {
                          setSubCategory((prev) =>
                            prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
                          );
                        }}
                        className="text-xs tracking-widest uppercase text-gray-600 cursor-pointer"
                      >
                        {labelize(type)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {(category.length > 0 || subCategory.length > 0) && (
                <button
                  onClick={() => { setCategory([]); setSubCategory([]); }}
                  className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors underline underline-offset-2 text-left"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* ── Produits ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
                {filterProducts.length} article{filterProducts.length !== 1 ? "s" : ""}
              </p>
              <select
                className="text-[10px] tracking-[0.2em] uppercase text-gray-500 border-b border-gray-300 bg-transparent pb-0.5 focus:outline-none cursor-pointer"
                onChange={(e) => setSort(e.target.value)}
                value={sort}
              >
                <option value="relevant">Pertinence</option>
                <option value="low-high">Prix croissant</option>
                <option value="high-low">Prix décroissant</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10">
              {filterProducts.map((item) => (
                <div key={item._id} className="relative">
                  <ProductItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    salePrice={item.salePrice}
                    sizes={item.sizes}
                    color={item.color}
                    colorGroup={item.colorGroup}
                  />
                </div>
              ))}
            </div>

            {filterProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400">Aucun article trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
