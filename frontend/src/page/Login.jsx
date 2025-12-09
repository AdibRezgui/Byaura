import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import bgVideo from "../assets/back.mp4";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, setToken, navigate, backendURL } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Sign Up") {
        // --- Inscription ---
        const response = await axios.post(`${backendURL}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("✅ Compte créé avec succès !");
          navigate("/");
        } else {
          toast.error(response.data.message || "Erreur lors de l’inscription");
        }
      } else {
        // --- Connexion ---
        const response = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("👋 Connexion réussie !");
          navigate("/");
        } else {
          toast.error(response.data.message || "Email ou mot de passe incorrect");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur : " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      <form
        onSubmit={onSubmitHandler}
        className="relative z-20 flex flex-col items-center w-[90%] sm:max-w-96 bg-black/60 p-8 rounded-xl shadow-lg text-white"
      >
        <div className="inline-flex items-center gap-2 mb-6">
          <p className="text-3xl font-semibold">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-white" />
        </div>

        {currentState === "Login" ? null : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-md mb-3 focus:outline-none"
            placeholder="Name"
            required
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-md mb-3 focus:outline-none"
          placeholder="Email"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 bg-transparent rounded-md mb-4 focus:outline-none"
          placeholder="Password"
          required
        />

        <div className="w-full flex justify-between text-sm mb-4">
          <p className="cursor-pointer">Forgot your password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer hover:underline"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:underline"
            >
              Login Here
            </p>
          )}
        </div>

        <button className="bg-white text-black font-medium px-8 py-2 rounded-md hover:bg-gray-200 transition">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
