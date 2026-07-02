import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js';

const STATUS_LABELS = {
  'Order Placed':    'Reçue',
  'Packing':         'Préparation',
  'Shipped':         'Expédiée',
  'Out for delivery':'En livraison',
  'Delivered':       'Livrée',
};

const statusStyle = (status) => {
  if (status === 'Delivered')        return 'text-green-600';
  if (status === 'Out for delivery') return 'text-amber-500';
  if (status === 'Shipped')          return 'text-blue-500';
  return 'text-gray-400';
};

const Orders = ({ token, currency = 'TND' }) => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('active');

  const fetchOrders = async () => {
    if (!token) return;
    const endpoint = tab === 'active' ? '/api/order/list' : '/api/order/archived';
    try {
      const { data } = await axios.post(backendUrl + endpoint, {}, { headers: { token } });
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status },
        { headers: { token } }
      );
      if (data.success) fetchOrders();
    } catch (e) { toast.error(e.message); }
  };

  const archiveOrder = async (orderId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/order/archive',
        { orderId },
        { headers: { token } }
      );
      if (data.success) { toast.success('Commande archivée'); fetchOrders(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.message); }
  };

  useEffect(() => { fetchOrders(); }, [token, tab]);

  return (
    <div className="pt-8 px-10 max-w-5xl">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Commandes</p>
          <p className="text-sm text-gray-900">
            {orders.length} commande{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-6">
          {[['active', 'Actives'], ['archived', 'Archivées']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] tracking-widest uppercase pb-1 border-b transition-colors ${
                tab === t
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-300 border-transparent hover:text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* En-têtes colonnes */}
      <div className="grid grid-cols-[32px_1fr_180px_160px] gap-6 items-center border-b border-gray-100 pb-3 mb-1">
        {['', 'Articles', 'Adresse', 'Détails'].map((h, i) => (
          <p key={i} className={`text-[9px] tracking-widest uppercase text-gray-300 ${i === 3 ? 'text-right' : ''}`}>
            {h}
          </p>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col">
        {orders.length === 0 && (
          <p className="text-sm text-gray-300 py-12 text-center">
            {tab === 'active' ? 'Aucune commande active.' : 'Aucune commande archivée.'}
          </p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-[32px_1fr_180px_160px] gap-6 items-start border-b border-gray-100 py-5 hover:bg-gray-50/40 transition-colors"
          >
            {/* Icône */}
            <img src={assets.parcel_icon} alt="" className="w-8 h-8 opacity-40 mt-0.5" />

            {/* Articles */}
            <div>
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed">
                  {item.name}{' '}
                  <span className="text-gray-400">× {item.quantity}</span>{' '}
                  <span className="text-[10px] tracking-widest uppercase text-gray-300">({item.size})</span>
                </p>
              ))}
              <p className="text-[10px] tracking-widest uppercase text-gray-300 mt-1.5">
                {new Date(order.date).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Adresse */}
            <div>
              <p className="text-sm text-gray-900">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{order.address.street}</p>
              <p className="text-xs text-gray-400">
                {order.address.city}, {order.address.country}
              </p>
              <p className="text-xs text-gray-400">{order.address.phone}</p>
            </div>

            {/* Détails + actions */}
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{order.amount} {currency}</p>

              <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">
                {order.paymentMethod === 'COD' ? 'Livraison' : order.paymentMethod}
                {' · '}
                <span style={{ color: order.payment ? '#28a745' : '#bbb' }}>
                  {order.payment ? 'Payé' : 'En attente'}
                </span>
              </p>

              {tab === 'archived' ? (
                <p className="text-[10px] tracking-widest uppercase text-gray-300 mt-3">
                  Archivée
                </p>
              ) : (
                <>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`mt-3 text-[10px] tracking-widest uppercase border border-gray-200 px-2 py-1 bg-white focus:outline-none focus:border-gray-400 transition-colors cursor-pointer ${statusStyle(order.status)}`}
                  >
                    <option value="Order Placed">Reçue</option>
                    <option value="Packing">Préparation</option>
                    <option value="Shipped">Expédiée</option>
                    <option value="Out for delivery">En livraison</option>
                    <option value="Delivered">Livrée</option>
                  </select>

                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => archiveOrder(order._id)}
                      className="mt-2 block ml-auto text-[10px] tracking-widest uppercase text-gray-300 hover:text-black transition-colors border-b border-transparent hover:border-gray-400"
                    >
                      Archiver
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
