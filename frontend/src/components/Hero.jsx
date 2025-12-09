import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import herobackground from "../assets/herobackground.mp4";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col sm:flex-row min-h-[80vh] overflow-hidden">
      {/* 🎥 Background Video */}
      <div className="absolute inset-0">
        <video
          src={herobackground}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
      </div>

      {/* 🧭 Left Content */}
      <div className="relative z-10 w-full sm:w-1/2 flex flex-col items-center sm:items-start justify-center px-8 sm:px-16 py-20 text-[#222]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-5 text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <p className="w-8 md:w-10 h-[2px] bg-[#222]" />
            <p className="text-sm font-medium tracking-wide uppercase">
              Our Bestsellers
            </p>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight text-[#111]">
            Latest <span className="italic font-light">Arrivals</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-md">
            Discover timeless pieces crafted with passion and elegance.
          </p>

          {/* 🛍️ Shop Now Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/collection")}
            className="mt-4 px-8 py-3 border border-black text-black font-semibold text-sm tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* 🖼 Right Side Spacer */}
      <div className="hidden sm:block sm:w-1/2" />
    </section>
  );
};

export default Hero;
