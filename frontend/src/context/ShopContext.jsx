import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 🌍 Création du contexte global
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "TND";
  const delivery_fee = 7;
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // 🛒 Ajouter au panier
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Veuillez sélectionner une taille !");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    toast.success("Produit ajouté au panier 🛒");

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // 🔢 Nombre total d’articles
  const getCartCount = () => {
    let total = 0;
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        total += cartItems[productId][size];
      }
    }
    return total;
  };

  // ✏️ Mettre à jour la quantité
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // 🧾 Charger le panier utilisateur
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendURL + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // 💰 Calcul du montant total
  const getCartAmount = () => {
    let total = 0;
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;
      for (const size in cartItems[productId]) {
        total += (product.price || 0) * (cartItems[productId][size] || 0);
      }
    }
    return total;
  };

  // 📦 Charger les produits
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`);
      if (response.data.success) {
        const fetched = response.data.products.map((p) => {
          const imageArray = Array.isArray(p.images)
            ? p.images.map((img) =>
                img.startsWith("/uploads/")
                  ? `${backendURL}${img.replace(/\\/g, "/")}`
                  : `${backendURL}/uploads/${img.replace(/\\/g, "/")}`
              )
            : [];

          return {
            ...p,
            images: imageArray,
            image:
              imageArray[0] ||
              "https://via.placeholder.com/400x400?text=No+Image",
          };
        });
        setProducts(fetched);
      } else {
        toast.error(response.data.message || "Erreur de chargement des produits");
      }
    } catch (error) {
      console.error("❌ Erreur de chargement :", error);
      toast.error("Impossible de charger les produits. Vérifie le serveur !");
    }
  };

  // 🔄 Charger produits au montage
  useEffect(() => {
    getProductsData();
  }, []);

  // 🧠 Restaurer le token et le panier utilisateur
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken); // 👈 on appelle la fonction ici
    }
  }, []);

  // 🧾 Debug panier
  useEffect(() => {
    console.log("🛒 Panier mis à jour :", cartItems);
  }, [cartItems]);

  // 📤 Valeurs disponibles globalement
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendURL,
    token,
    setToken,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
