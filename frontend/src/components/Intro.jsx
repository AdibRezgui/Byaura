import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import intro from "../assets/intro.mp4"

const Intro = ({ onFinish }) => {
  const [step, setStep] = useState(0)
  const videoRef = useRef(null)

  // Quand la vidéo se termine → afficher le logo
  const handleVideoEnd = () => setStep(1)

  // Après le logo → transition vers le site
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => onFinish(), 3500)
      return () => clearTimeout(timer)
    }
  }, [step, onFinish])

  // Si on clique → passer directement au logo
  const handleSkip = () => {
    if (step === 0) setStep(1)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-pointer overflow-hidden"
      onClick={handleSkip}
    >
      <AnimatePresence mode="wait">
        {/* 🎬 Étape 1 : Lecture de la vidéo */}
        {step === 0 && (
          <motion.div
            key="video"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <video
              ref={videoRef}
              src={intro}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(1.1) contrast(1.05)",
                transform: "scale(1.02)", // léger zoom immersif
              }}
            />
          </motion.div>
        )}

        {/* ✨ Étape 2 : Logo “By aura” */}
        {step === 1 && (
          <motion.div
            key="logo"
            className="absolute inset-0 bg-white flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm uppercase tracking-widest text-gray-700 mb-2"
            >
              By
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl sm:text-7xl font-bold text-black font-serif"
            >
              aura<span className="text-black">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-sm tracking-[4px] text-gray-700 mt-2"
            >
              READY TO WEAR
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Intro
