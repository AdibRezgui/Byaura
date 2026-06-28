import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => (
  <footer className="border-t border-gray-100 mt-24">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-14">

      {/* Marque */}
      <div className="flex flex-col gap-4">
        <img src={assets.logo} className="w-24" alt="Aura" />
        <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
          Prêt-à-porter éditorial. Conçu à Tunis.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">Navigation</p>
        {[
          { to: "/collection", label: "Collection" },
          { to: "/lookbook",   label: "Lookbook" },
          { to: "/pop-ups",    label: "Pop Ups" },
          { to: "/about",      label: "À propos" },
          { to: "/contact",    label: "Contact" },
        ].map(({ to, label }) => (
          <Link key={to} to={to}
            className="text-xs text-gray-500 hover:text-black transition-colors w-fit">
            {label}
          </Link>
        ))}
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">Contact</p>
        <a href="mailto:contact@byaura.com"
          className="text-xs text-gray-500 hover:text-black transition-colors w-fit">
          contact@byaura.com
        </a>
        <a href="https://instagram.com/byaura" target="_blank" rel="noreferrer"
          className="text-xs text-gray-500 hover:text-black transition-colors w-fit">
          @byaura
        </a>
        <p className="text-xs text-gray-400 mt-2">Tunis, Tunisie</p>
      </div>
    </div>

    <div className="border-t border-gray-100 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-[10px] text-gray-300 tracking-widest">© 2025 BY AURA. TOUS DROITS RÉSERVÉS.</p>
      <div className="flex gap-5">
        <Link to="/mentions-legales" className="text-[10px] text-gray-300 hover:text-black transition-colors tracking-widest">MENTIONS LÉGALES</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
