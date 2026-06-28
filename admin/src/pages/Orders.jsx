import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js';

const Orders = ({ token, currency = 'TND' }) => {
  const [orders, setOrders] = useState([]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status },
        { headers: { token } }
      );
      if (data.success) {
        fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // 🎨 Styles en ligne
  const styles = {
    container: {
      padding: '40px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '25px',
      color: '#222',
    },
    card: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.07)',
      padding: '20px 25px',
      marginBottom: '20px',
      transition: 'all 0.2s ease',
    },
    left: {
      display: 'flex',
      gap: '15px',
      width: '40%',
    },
    icon: {
      width: '50px',
      height: '50px',
      opacity: 0.85,
    },
    items: {
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.5',
    },
    middle: {
      width: '30%',
      fontSize: '14px',
      color: '#555',
    },
    name: {
      fontWeight: '600',
      fontSize: '15px',
      color: '#111',
      marginBottom: '5px',
    },
    right: {
      width: '25%',
      textAlign: 'right',
      fontSize: '13.5px',
    },
    infoLine: {
      margin: '3px 0',
      color: '#444',
    },
    bold: {
      fontWeight: '600',
      color: '#222',
    },
    amount: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#2b2b2b',
      marginTop: '8px',
    },
    select: {
      border: '1px solid #ccc',
      borderRadius: '6px',
      padding: '6px 10px',
      background: '#f8f8f8',
      fontSize: '13px',
      marginTop: '10px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Commandes</h3>

      {orders.map((order, index) => (
        <div
          key={index}
          style={{
            ...styles.card,
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {/* --- Partie gauche : icône + produits --- */}
          <div style={styles.left}>
            <img src={assets.parcel_icon} alt="parcel" style={styles.icon} />
            <div style={styles.items}>
              {order.items.map((item, item_index) => (
                <p key={item_index}>
                  {item.name} x {item.quantity}{' '}
                  <span style={{ color: '#777' }}>({item.size})</span>
                </p>
              ))}
            </div>
          </div>

          {/* --- Partie milieu : adresse --- */}
          <div style={styles.middle}>
            <p style={styles.name}>
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{' '}
              {order.address.country} {order.address.zipcode}
            </p>
            <p>{order.address.phone}</p>
          </div>

          {/* --- Partie droite : infos, montant, statut --- */}
          <div style={styles.right}>
            <p style={styles.infoLine}>
              Articles : <span style={styles.bold}>{order.items.length}</span>
            </p>
            <p style={styles.infoLine}>
              Paiement : <span style={styles.bold}>{order.paymentMethod === 'COD' ? 'À la livraison' : order.paymentMethod}</span>
            </p>
            <p style={styles.infoLine}>
              Statut paiement :{' '}
              <span style={{ ...styles.bold, color: order.payment ? '#28a745' : '#d9534f' }}>
                {order.payment ? 'Payé' : 'En attente'}
              </span>
            </p>
            <p style={styles.infoLine}>
              Date :{' '}
              <span style={styles.bold}>
                {new Date(order.date).toLocaleDateString('fr-FR')}
              </span>
            </p>

            {/* ✅ Prix avant devise */}
            <p style={styles.amount}>
              {order.amount} {currency}
            </p>

            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              style={{
                ...styles.select,
                background:
                  order.status === 'Delivered'
                    ? '#d4edda'
                    : order.status === 'Out for delivery'
                    ? '#fff3cd'
                    : '#f8f8f8',
                borderColor:
                  order.status === 'Delivered'
                    ? '#28a745'
                    : order.status === 'Out for delivery'
                    ? '#ffc107'
                    : '#ccc',
                color:
                  order.status === 'Delivered'
                    ? '#155724'
                    : order.status === 'Out for delivery'
                    ? '#856404'
                    : '#333',
              }}
            >
              <option value="Order Placed">Commande reçue</option>
              <option value="Packing">En préparation</option>
              <option value="Shipped">Expédiée</option>
              <option value="Out for delivery">En livraison</option>
              <option value="Delivered">Livrée</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
