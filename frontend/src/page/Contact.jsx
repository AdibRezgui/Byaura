import { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
  const { siteConfig, backendURL } = useContext(ShopContext);

  const contactImage = siteConfig?.contactImage
    ? (siteConfig.contactImage.startsWith("http") ? siteConfig.contactImage : `${backendURL}${siteConfig.contactImage}`)
    : assets.contactcover;

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
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3 opacity-60">Tunis, Tunisie</p>
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
              <a href="mailto:contact@byaura.com"
                className="text-sm text-gray-700 hover:text-black transition-colors">
                contact@byaura.com
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-2">Instagram</p>
              <a href="https://instagram.com/byaura" target="_blank" rel="noreferrer"
                className="text-sm text-gray-700 hover:text-black transition-colors">
                @byaura
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-2">Localisation</p>
              <p className="text-sm text-gray-700 leading-relaxed">
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `mailto:contact@byaura.com?subject=${encodeURIComponent(e.target.subject.value)}&body=${encodeURIComponent(e.target.message.value)}`;
            }}
            className="flex flex-col gap-7"
          >
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
              className="mt-2 self-start bg-black text-white text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-gray-800 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Contact;
