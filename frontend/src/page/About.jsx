import { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const About = () => {
  const { siteConfig, backendURL } = useContext(ShopContext);

  const aboutImage = siteConfig?.aboutImage
    ? (siteConfig.aboutImage.startsWith("http") ? siteConfig.aboutImage : `${backendURL}${siteConfig.aboutImage}`)
    : assets.aboutcover;

  return (
    <div className="-mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] text-gray-900">

      {/* ── Hero plein écran ─────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: "90svh" }}>
        <img
          src={aboutImage}
          alt="Aura"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 sm:pb-16 px-6 sm:px-10 lg:px-20 text-white">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-4 opacity-60">Ready to wear — Tunis</p>
          <h1 className="prata-regular text-5xl sm:text-6xl lg:text-8xl font-light leading-none">by aura.</h1>
        </div>
      </div>

      {/* ── Intro éditoriale ─────────────────────────────────────── */}
      <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-16 sm:py-20 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-32">
          <div className="lg:w-1/3 flex-shrink-0">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400">Notre histoire</p>
          </div>
          <div className="lg:w-2/3">
            <p className="prata-regular text-2xl sm:text-3xl text-gray-900 leading-relaxed mb-8">
              Aura est née d'une conviction simple — que la mode peut être à la fois accessible et profondément éditoriale.
            </p>
            <p className="text-sm text-gray-500 leading-loose max-w-xl">
              Fondée à Tunis, Aura propose des pièces prêt-à-porter pensées pour la femme contemporaine. Chaque collection est construite autour de silhouettes nettes, de matières soignées et d'un regard éditorial assumé. Nous croyons en la beauté du vêtement juste — celui qu'on porte, qu'on ressent, qu'on garde.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3 valeurs ────────────────────────────────────────────── */}
      <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-16 sm:py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {[
            { label: "01", title: "Qualité", body: "Des matières sélectionnées avec soin. Chaque pièce est conçue pour durer, au-delà des saisons." },
            { label: "02", title: "Éditorial", body: "Un regard photographique assumé. La collection vit à travers des images qui racontent une histoire." },
            { label: "03", title: "Tunisie", body: "Née et pensée à Tunis. Un ancrage local, une ambition internationale." },
          ].map((item) => (
            <div key={item.label} className="py-10 sm:py-0 sm:px-12 first:pl-0 last:pr-0 flex flex-col gap-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-300">{item.label}</span>
              <p className="prata-regular text-xl text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vision ───────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white px-6 sm:px-12 md:px-20 lg:px-32 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-10">Notre vision</p>
          <p className="prata-regular text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-light">
            "Créer des vêtements qui parlent avant même d'être portés."
          </p>
          <div className="mt-12 w-12 h-px bg-white/20 mx-auto" />
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 border-t border-gray-100">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-2">Découvrez la collection</p>
          <p className="text-sm text-gray-500">Des pièces pensées pour vous.</p>
        </div>
        <Link to="/collection"
          className="text-[11px] tracking-[0.3em] uppercase border-b border-gray-900 pb-0.5 hover:opacity-40 transition-opacity flex-shrink-0">
          Explorer →
        </Link>
      </div>

    </div>
  );
};

export default About;
