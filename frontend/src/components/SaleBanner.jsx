import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const SaleBanner = () => {
  const { activeSale } = useContext(ShopContext);
  const navigate = useNavigate();

  if (!activeSale) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  };

  const endFormatted = formatDate(activeSale.endDate);

  const text = endFormatted
    ? `${activeSale.name} — Jusqu'au ${endFormatted}`
    : activeSale.name;

  return (
    <div
      className="w-full bg-black py-2.5 cursor-pointer flex items-center justify-center"
      onClick={() => navigate("/collection?soldes=1")}
    >
      <p className="text-[10px] tracking-[0.4em] uppercase text-white/80">
        {text}
      </p>
    </div>
  );
};

export default SaleBanner;
