import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 🌍 Création du contexte global
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "TND";
  const delivery_fee = 7;
  const backendURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [colorGroups, setColorGroups] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [siteConfig, setSiteConfig] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [activeSale, setActiveSale] = useState(null);
  const [saleProducts, setSaleProducts] = useState([]);
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
    toast.success("Produit ajouté au panier");

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          setToken("");
        }
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
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          setToken("");
        }
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
      // Token expiré ou invalide → déconnexion silencieuse
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
      }
    }
  };

  // 💰 Calcul du montant total (utilise salePrice si l'article est soldé)
  const getCartAmount = () => {
    let total = 0;
    for (const productId in cartItems) {
      // Comparaison loose pour gérer number vs string
      const product = products.find((p) => String(p._id) === String(productId));
      if (!product) continue;
      const effectivePrice =
        product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      for (const size in cartItems[productId]) {
        total += (effectivePrice || 0) * (cartItems[productId][size] || 0);
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
            ? p.images.map((img) => {
                const cleaned = img.replace(/\\/g, "/");
                // URL Cloudinary ou autre URL absolue → on la laisse telle quelle
                if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
                // Chemin local /uploads/... → préfixer avec backendURL
                return `${backendURL}${cleaned.startsWith("/") ? cleaned : "/uploads/" + cleaned}`;
              })
            : [];

          return {
            ...p,
            images: imageArray,
            image: imageArray[0] || null,
          };
        });
        setProducts(fetched);
        // Build colorGroups map: { groupId -> Product[] }
        const groups = {};
        fetched.forEach((p) => {
          if (p.colorGroup) {
            if (!groups[p.colorGroup]) groups[p.colorGroup] = [];
            groups[p.colorGroup].push(p);
          }
        });
        setColorGroups(groups);
      } else {
        toast.error(response.data.message || "Erreur de chargement des produits");
      }
    } catch (error) {
      console.error("❌ Erreur de chargement :", error);
      toast.error("Impossible de charger les produits. Vérifie le serveur !");
    }
  };

  // 🎨 Charger la config du site (hero, about, contact, logo)
  const getSiteConfig = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/config`);
      if (data.success) setSiteConfig(data);
    } catch {}
  };

  const getCampaigns = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/campaign`);
      if (data.success) setCampaigns(data.campaigns || []);
    } catch {}
  };

  const getActiveSale = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/sale/active`);
      if (data.success) {
        setActiveSale(data.sale || null);
        const mapped = (data.products || []).map((p) => {
          const imageArray = Array.isArray(p.images)
            ? p.images.map((img) => {
                const cleaned = img.replace(/\\/g, "/");
                if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
                return `${backendURL}${cleaned.startsWith("/") ? cleaned : "/uploads/" + cleaned}`;
              })
            : [];
          return { ...p, images: imageArray, image: imageArray[0] || null };
        });
        setSaleProducts(mapped);
      }
    } catch {}
  };

  // 🔄 Charger produits + config au montage
  useEffect(() => {
    getProductsData();
    getSiteConfig();
    getCampaigns();
    getActiveSale();
  }, []);

  // 🧠 Restaurer le token + panier au montage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, []);

  // 📸 Charger la photo de profil dès que le token est disponible (login ou refresh)
  useEffect(() => {
    if (!token) { setProfileImage(""); return; }
    axios.get(`${backendURL}/api/user/profile`, { headers: { token } })
      .then(({ data }) => { if (data.success) setProfileImage(data.profileImage || ""); })
      .catch(() => {});
  }, [token]);

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
    profileImage,
    setProfileImage,
    siteConfig,
    getSiteConfig,
    colorGroups,
    campaigns,
    activeSale,
    saleProducts,
    getActiveSale,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
