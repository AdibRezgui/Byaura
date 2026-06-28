import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { backendURL, token, navigate, profileImage, setProfileImage } = useContext(ShopContext);
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingName, setLoadingName] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    axios.get(`${backendURL}/api/user/profile`, { headers: { token } })
      .then(({ data }) => {
        if (data.success) {
          setName(data.name);
          setNameInput(data.name);
          setEmail(data.email);
        }
      })
      .catch(() => toast.error('Erreur chargement profil'));
  }, [token]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return; }
    setUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const { data } = await axios.post(`${backendURL}/api/user/profile/image`, form, {
        headers: { token }
      });
      if (data.success) {
        setProfileImage(data.imageUrl);
        toast.success('Photo mise à jour');
      } else {
        toast.error(data.message);
      }
    } catch { toast.error('Erreur upload'); }
    finally { setUploadingPhoto(false); }
  };

  const saveName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) { toast.error('Le nom ne peut pas être vide'); return; }
    setLoadingName(true);
    try {
      const { data } = await axios.put(
        `${backendURL}/api/user/profile`,
        { name: nameInput },
        { headers: { token } }
      );
      if (data.success) { setName(nameInput); toast.success('Nom mis à jour'); }
      else toast.error(data.message);
    } catch { toast.error('Erreur réseau'); }
    finally { setLoadingName(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (newPassword.length < 8) { toast.error('8 caractères minimum'); return; }
    setLoadingPwd(true);
    try {
      const { data } = await axios.put(
        `${backendURL}/api/user/profile`,
        { currentPassword, newPassword },
        { headers: { token } }
      );
      if (data.success) {
        toast.success('Mot de passe mis à jour');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        toast.error(data.message);
      }
    } catch { toast.error('Erreur réseau'); }
    finally { setLoadingPwd(false); }
  };

  return (
    <div className="min-h-[60vh] border-t pt-12 pb-20 max-w-lg mx-auto px-4">
      {/* En-tête */}
      <div className="mb-10 flex items-center gap-5">
        <div className="relative group">
          {profileImage ? (
            <img
              src={profileImage?.startsWith("http") ? profileImage : `${backendURL}${profileImage}`}
              alt="profil"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-semibold">
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute inset-0 rounded-full bg-black/40 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            {uploadingPhoto ? '...' : 'Modifier'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <div>
          <h1 className="text-2xl font-light tracking-wide">{name}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{email}</p>
          <p className="text-xs text-gray-400 mt-1 cursor-pointer hover:text-black underline underline-offset-2"
             onClick={() => fileInputRef.current?.click()}>
            Changer la photo
          </p>
        </div>
      </div>

      {/* Section — Changer le nom */}
      <div className="border rounded-xl p-6 mb-6 bg-white shadow-sm">
        <h2 className="font-medium text-sm tracking-widest text-gray-500 mb-5">INFORMATIONS</h2>
        <form onSubmit={saveName} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nom affiché</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <input
              type="text"
              value={email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loadingName || nameInput === name}
            className="self-start bg-black text-white px-6 py-2.5 text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loadingName ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Section — Changer le mot de passe */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="font-medium text-sm tracking-widest text-gray-500 mb-5">SÉCURITÉ</h2>
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loadingPwd || !currentPassword || !newPassword || !confirmPassword}
            className="self-start bg-black text-white px-6 py-2.5 text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loadingPwd ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
