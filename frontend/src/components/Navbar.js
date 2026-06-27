import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: '#2c3e50', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
      {location.pathname !== '/' && (
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Smart Courier
        </Link>
      )}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/track" style={{ color: '#ccc', textDecoration: 'none' }}>Track Parcel</Link>
            <Link to="/dashboard" style={{ color: '#ccc', textDecoration: 'none' }}>Dashboard</Link>
            {(user.role === 'admin' || user.role === 'customer') && (
              <Link to="/create-parcel" style={{ color: '#ccc', textDecoration: 'none' }}>Send Parcel</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/manage-parcels" style={{ color: '#ccc', textDecoration: 'none' }}>Manage</Link>
            )}
            <span style={{ color: '#ccc' }}>Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 14px' }}>Logout</button>
          </>
        ) : (
          location.pathname !== '/' && (
            <>
              <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#ccc', textDecoration: 'none' }}>Register</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;