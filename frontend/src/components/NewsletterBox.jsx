import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const { backendURL } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendURL}/api/newsletter/subscribe`, { email });
      if (data.success) {
        setSent(true);
        setEmail("");
      } else {
        toast.error(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-100 pt-16 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">

        {/* Texte */}
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-3">Newsletter</p>
          <h2 className="prata-regular text-2xl sm:text-3xl text-gray-900 font-light leading-snug">
            Restez dans la boucle éditoriale.
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-sm leading-relaxed">
            Nouvelles collections, pop-ups, lookbooks — en avant-première.
          </p>
        </div>

        {/* Formulaire */}
        <div className="w-full sm:w-auto sm:min-w-[340px]">
          {sent ? (
            <p className="text-sm text-gray-500 tracking-wide py-3 border-b border-gray-200">
              Merci — vous êtes abonné(e).
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex items-end gap-0 border-b border-gray-900">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 py-3 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[10px] tracking-[0.3em] uppercase text-gray-900 hover:opacity-50 transition-opacity pb-3 pl-4 flex-shrink-0 disabled:opacity-30"
              >
                {loading ? "…" : "S'abonner"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default NewsletterBox;
