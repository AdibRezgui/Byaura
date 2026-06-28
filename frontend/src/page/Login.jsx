import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import bgVideo from "../assets/back.mp4";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Inscription");
  const { token, setToken, navigate, backendURL, siteConfig } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const videoSrc = siteConfig?.loginVideo
    ? (siteConfig.loginVideo.startsWith("http") ? siteConfig.loginVideo : `${backendURL}${siteConfig.loginVideo}`)
    : bgVideo;

  const isSignUp = currentState === "Inscription";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        const response = await axios.post(`${backendURL}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Compte créé avec succès !");
          navigate("/");
        } else {
          toast.error(response.data.message || "Erreur lors de l'inscription");
        }
      } else {
        const response = await axios.post(`${backendURL}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Connexion réussie !");
          navigate("/");
        } else {
          toast.error(response.data.message || "Email ou mot de passe incorrect");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Erreur serveur");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const inputCls = "w-full border-b border-white/30 py-3 text-sm text-white bg-transparent focus:outline-none focus:border-white transition-colors placeholder:text-white/40";
  const labelCls = "text-[9px] tracking-[0.3em] uppercase text-white/50 block mb-1";

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Vidéo fond */}
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay loop muted playsInline src={videoSrc}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* Formulaire éditorial */}
      <form
        onSubmit={onSubmitHandler}
        className="relative z-20 flex flex-col w-[88%] sm:w-[420px] px-8 sm:px-12 py-12 border border-white/15 bg-black/30 backdrop-blur-md"
      >
        {/* Titre */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.45em] uppercase text-white/40 mb-3">
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </p>
          <h1 className="prata-regular text-3xl sm:text-4xl text-white font-light leading-none">
            {isSignUp ? "Inscription." : "Connexion."}
          </h1>
        </div>

        {/* Champs */}
        <div className="flex flex-col gap-7">
          {isSignUp && (
            <div>
              <label className={labelCls}>Prénom</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className={inputCls}
                placeholder="Votre prénom"
                required
              />
            </div>
          )}
          <div>
            <label className={labelCls}>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className={inputCls}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Mot de passe</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className={inputCls}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-7 mb-10 text-right">
          {isSignUp ? (
            <button type="button"
              onClick={() => setCurrentState("Connexion")}
              className="text-[11px] tracking-widest uppercase text-white/50 hover:text-white transition-colors border-b border-white/20 pb-0.5">
              Déjà un compte ?
            </button>
          ) : (
            <button type="button"
              onClick={() => setCurrentState("Inscription")}
              className="text-[11px] tracking-widest uppercase text-white/50 hover:text-white transition-colors border-b border-white/20 pb-0.5">
              Créer un compte
            </button>
          )}
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-white text-black text-[11px] tracking-[0.3em] uppercase py-4 hover:bg-gray-100 transition-colors font-medium"
        >
          {isSignUp ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;
