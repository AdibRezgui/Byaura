import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // ✅ chemin corrigé

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/product/list");
      if (data.success) {
        setList(data.products);
      } else {
        toast.error("Erreur lors du chargement des produits");
      }
    } catch (error) {
      toast.error("Erreur serveur : " + error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ⚙️ vérifie que le token est bien stocké
      const { data } = await axios.post(
        "http://localhost:4000/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Produit supprimé !");
        fetchList();
      } else {
        toast.error(data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur serveur : " + error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container" style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>📦 Liste des Produits</h2>

      <div className="table-container" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <tr>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Catégorie</th>
              <th style={thStyle}>Prix (TND)</th>
              <th style={thStyle}>Bestseller</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((item) => (
                <tr key={item._id} style={trStyle}>
                  <td style={tdStyle}>
                    <img
                      src={`http://localhost:4000${item.images[0]}`}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                      onError={(e) => (e.target.src = assets.placeholder)}
                    />
                  </td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.category}</td>
                  <td style={tdStyle}>{item.price} TND</td>
                  <td style={tdStyle}>{item.bestseller ? "✅" : "❌"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeProduct(item._id)}
                      style={{
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles réutilisables
const thStyle = {
  padding: "12px 16px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
  fontSize: "15px",
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

const trStyle = {
  transition: "background-color 0.2s ease",
  cursor: "pointer",
};

export default List;
