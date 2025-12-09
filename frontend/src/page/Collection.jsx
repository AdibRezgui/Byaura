import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const productsSafe = products || [];
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(productsSafe);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sort, setSort] = useState("relevant");

  // ✅ Toggle category
  const toggleCategory = (e) => {
    const value = (e.target.value || "").toLowerCase();
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  // ✅ Toggle subCategory
  const toggleSubCategory = (e) => {
    const value = (e.target.value || "").toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  // ✅ Filtrage / tri / recherche
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

  // Initialisation
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

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* 🧮 FILTRES */}
      <div className="min-w-60">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter((s) => !s)}
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-180" : ""
            }`}
            src={assets.down}
            alt="filter-icon"
          />
        </p>

        {/* CATEGORY */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["men", "women"].map((cat) => (
              <p className="flex gap-2" key={cat}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />{" "}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </p>
            ))}
          </div>
        </div>

        {/* SUBCATEGORY */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {subTypes.map((type) => (
              <p className="flex gap-2" key={type}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(type)}
                />{" "}
                {labelize(type)}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 🛍️ PRODUITS */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => setSort(e.target.value)}
            value={sort}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filterProducts.map((item) => {
            const imgSrc = item.image || "/placeholder.png"; // ✅ première image du produit

            return (
              <div
                key={item._id}
                className="border p-3 rounded overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img
                  src={imgSrc}
                  alt={item.name || "Produit"}
                  className="w-full h-64 object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                <p className="mt-2 font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.price} TND</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collection;
