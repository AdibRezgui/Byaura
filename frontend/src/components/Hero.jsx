import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import herobackground from "../assets/herobackground.mp4";

const Hero = () => {
  const navigate = useNavigate();
  const { siteConfig, backendURL } = useContext(ShopContext);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const slides = siteConfig?.heroSlides?.length > 0
    ? siteConfig.heroSlides
    : [{ url: null, type: "video" }];

  const total = slides.length;

  const goTo = (idx, dir) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  };

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1, 1);

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
      setDirection(1);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  const slide = slides[current];
  const mediaUrl = slide.url
    ? (slide.url.startsWith("http") ? slide.url : `${backendURL}${slide.url}`)
    : null;

  return (
    <section className="relative w-full min-h-[88vh] overflow-hidden bg-black">
      {/* ─── Media Layer ─────────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (d) => ({ opacity: 0, scale: 1.04, x: d > 0 ? 40 : -40 }),
            center: { opacity: 1, scale: 1, x: 0 },
            exit: (d) => ({ opacity: 0, scale: 0.98, x: d > 0 ? -40 : 40 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.type === "video" ? (
            <video
              key={mediaUrl || "default"}
              src={mediaUrl || herobackground}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="hero"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark vignette for text readability — no white overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ─── Text Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 min-h-[88vh] flex flex-col justify-end px-8 sm:px-16 pb-14 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-6">
            Aura — Collection 2026
          </p>

          <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.08em] uppercase leading-none mb-3">
            Nouvelle
          </h1>
          <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.08em] uppercase leading-none mb-10">
            Collection
          </h1>

          <motion.button
            whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/collection")}
            className="inline-flex items-center gap-4 border border-white/70 text-white text-[11px] tracking-[0.3em] uppercase px-8 py-4 transition-colors duration-300"
          >
            Découvrir
            <span className="text-base leading-none">→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ─── Prev / Next Arrows ──────────────────────────────────────── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white text-xl transition-all"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white text-xl transition-all"
          >
            ›
          </button>
        </>
      )}

      {/* ─── Slide Indicators ────────────────────────────────────────── */}
      {total > 1 && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`h-[3px] rounded-full transition-all duration-400 ${
                i === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
