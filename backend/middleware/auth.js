import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization ou token
    const authHeader = req.headers.authorization || req.headers.token;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Token manquant" });
    }

    // Retirer "Bearer " si présent
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'id utilisateur
    req.userId = decoded.id || decoded._id;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ success: false, message: "Token invalide ou expiré" });
  }
};

export default authUser;
