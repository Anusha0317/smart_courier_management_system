import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <div style={{ textAlign: 'center', padding: '80px 20px 40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#2c3e50', marginBottom: '12px' }}>
          Smart Courier Management System
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
          Fast, reliable and trackable parcel delivery across Ireland
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{ padding: '12px 36px', fontSize: '16px' }}>
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ padding: '12px 36px', fontSize: '16px', background: 'white', color: '#2c3e50', border: '2px solid #2c3e50', borderRadius: '6px', cursor: 'pointer' }}>
            Register
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '700px', margin: '0 auto' }}>
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '8px' }}>Send Parcels</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Easy and quick parcel booking with tracking number</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '8px' }}>Live Tracking</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Track your parcel in real time on an interactive map</p>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚚</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '8px' }}>Fast Delivery</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Nationwide delivery with real time status updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;