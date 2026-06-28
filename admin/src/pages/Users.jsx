import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { backendUrl } from "../App";

const Users = ({ token }) => {
  const [tab, setTab] = useState("users"); // "users" | "newsletter"
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const fetchUsers = () => {
    axios.get(`${backendUrl}/api/user/list`, { headers: { token } })
      .then(({ data }) => { if (data.success) setUsers(data.users); })
      .catch(() => toast.error("Erreur chargement utilisateurs"));
  };

  const fetchSubscribers = async () => {
    setLoadingSubs(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/newsletter/subscribers`, { headers: { token } });
      if (data.success) setSubscribers(data.emails || []);
    } catch { toast.error("Erreur chargement abonnés"); }
    finally { setLoadingSubs(false); }
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { if (tab === "newsletter") fetchSubscribers(); }, [tab]);

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/${id}`, { headers: { token } });
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("Utilisateur supprimé");
      } else toast.error(data.message);
    } catch { toast.error("Erreur lors de la suppression"); }
    setConfirm(null);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-4">
        <button
          onClick={() => setTab("users")}
          className={`text-sm font-medium transition-colors ${tab === "users" ? "text-gray-900 border-b-2 border-gray-900 pb-4 -mb-4" : "text-gray-400 hover:text-gray-600"}`}
        >
          Membres <span className="text-xs ml-1">({users.length})</span>
        </button>
        <button
          onClick={() => setTab("newsletter")}
          className={`text-sm font-medium transition-colors ${tab === "newsletter" ? "text-gray-900 border-b-2 border-gray-900 pb-4 -mb-4" : "text-gray-400 hover:text-gray-600"}`}
        >
          Newsletter <span className="text-xs ml-1">({subscribers.length})</span>
        </button>
      </div>

      {tab === "users" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">{users.length} membre{users.length !== 1 ? "s" : ""}</p>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Rechercher…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-black w-52 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length > 0 ? filtered.map(u => (
              <div key={u.id}
                className="flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  {u.profileImage ? (
                    <img
                      src={u.profileImage.startsWith("http") ? u.profileImage : `${backendUrl}${u.profileImage}`}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-sm flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirm({ id: u.id, name: u.name })}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            )) : (
              <div className="text-center py-16 text-gray-400 text-sm">
                {search ? "Aucun résultat pour cette recherche." : "Aucun utilisateur."}
              </div>
            )}
          </div>
        </>
      )}

      {tab === "newsletter" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">{subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}</p>
            <button onClick={fetchSubscribers} disabled={loadingSubs}
              className="text-[10px] tracking-widest uppercase border-b border-gray-400 text-gray-400 hover:text-black hover:border-black transition-colors disabled:opacity-30">
              {loadingSubs ? "…" : "Actualiser"}
            </button>
          </div>

          {subscribers.length > 0 ? (
            <div className="flex flex-col gap-1">
              {subscribers.map((email, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 bg-white border border-gray-100 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{email}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 text-sm">
              {loadingSubs ? "Chargement…" : "Aucun abonné pour le moment."}
            </div>
          )}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={`Supprimer le compte de "${confirm.name}" ?`}
          onConfirm={() => deleteUser(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default Users;
