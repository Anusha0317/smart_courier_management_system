import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const roleCards = [
    {
      role: 'customer',
      icon: '👤',
      title: 'Customer',
      desc: 'Send and track parcels'
    },
    {
      role: 'courier',
      icon: '🚚',
      title: 'Courier',
      desc: 'Manage your deliveries'
    },
    {
      role: 'admin',
      icon: '🛠️',
      title: 'Admin',
      desc: 'Manage the whole system'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2c3e50', marginBottom: '8px' }}>
          Smart Courier Management System
        </h1>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
          Choose how you'd like to continue
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '750px', margin: '0 auto 40px' }}>
          {roleCards.map(card => (
            <div key={card.role} className="card" style={{ padding: '25px 20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{card.icon}</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '4px' }}>{card.title}</h3>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>{card.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => navigate('/login', { state: { role: card.role } })}
                  className="btn btn-primary"
                  style={{ width: '100%' }}>
                  Login
                </button>
                <button
                  onClick={() => navigate('/register', { state: { role: card.role } })}
                  style={{ width: '100%', padding: '10px', background: 'white', color: '#2c3e50', border: '2px solid #2c3e50', borderRadius: '6px', cursor: 'pointer' }}>
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#555' }}>📦 Send Parcels</div>
          <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#555' }}>🗺️ Live Tracking</div>
          <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px 20px', fontSize: '13px', color: '#555' }}>🚚 Fast Delivery</div>
        </div>
      </div>
    </div>
  );
};

export default Home;