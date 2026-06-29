import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
  const { siteConfig, backendURL } = useContext(ShopContext);
  const [sending, setSending] = useState(false);

  const contactImage = siteConfig?.contactImage
    ? (siteConfig.contactImage.startsWith("http") ? siteConfig.contactImage : `${backendURL}${siteConfig.contactImage}`)
    : assets.contactcover;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setSending(true);
    try {
      const { data } = await axios.post(`${backendURL}/api/contact`, {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
      });
      if (data.success) {
        toast.success("Message envoyé !");
        form.reset();
      } else {
        toast.error(data.message || "Erreur lors de l'envoi.");
      }
    } catch {
      toast.error("Impossible d'envoyer le message. Réessayez plus tard.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] text-gray-900">

      {/* ── Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "55svh" }}>
        <img
          src={contactImage}
          alt="Aura Contact"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-10 sm:pb-14 px-6 sm:px-12 lg:px-20 text-white">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3 opacity-60">La Marsa, Tunis, Tunisie</p>
          <h1 className="prata-regular text-4xl sm:text-5xl font-light leading-none">Contact.</h1>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="flex flex-col lg:flex-row">

        {/* Infos de contact */}
        <div className="w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-16 border-b lg:border-b-0 lg:border-r border-gray-100">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-10">Nous contacter</p>

          <div className="flex flex-col gap-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-2">Email</p>
              <a href="mailto:byaurardtw@gmail.com"
                className="text-sm text-gray-700 hover:text-black transition-colors">
                byaurardtw@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-2">Instagram</p>
              <a href="https://instagram.com/byaura" target="_blank" rel="noreferrer"
                className="text-sm text-gray-700 hover:text-black transition-colors">
                @byaurartw
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-2">Localisation</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Avenue Abderahmane Mami, La Marsa<br />
                Tunis, Tunisie
              </p>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100">
            <p className="prata-regular text-xl text-gray-900 leading-relaxed">
              "Pour toute question sur une commande, une pièce ou une collaboration — écrivez-nous."
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-10">Envoyer un message</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1.5">Nom</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Votre nom"
                className="w-full border-b border-gray-200 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                className="w-full border-b border-gray-200 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1.5">Sujet</label>
              <input
                name="subject"
                type="text"
                required
                placeholder="Objet de votre message"
                className="w-full border-b border-gray-200 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-widest uppercase text-gray-400 block mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Votre message..."
                className="w-full border-b border-gray-200 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-300 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-2 self-start bg-black text-white text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Contact;
