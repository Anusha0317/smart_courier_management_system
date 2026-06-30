import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/parcels');
        setParcels(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchParcels();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/parcels/${id}/status`, { status });
      setParcels(parcels.map(p => p._id === id ? { ...p, status } : p));
      setMessage('Status updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  if (user.role === 'courier') {
    return (
      <div style={{ padding: '20px 0' }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', padding: '0' }}>
          ← Back
        </button>
        <h2 style={{ marginBottom: '20px' }}>My Deliveries — {user.name}</h2>
        {message && <div className="alert alert-success">{message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#2c3e50' }}>{parcels.length}</h3>
            <p style={{ color: '#666' }}>Total Assigned</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#f39c12' }}>{parcels.filter(p => p.status === 'pending' || p.status === 'picked_up').length}</h3>
            <p style={{ color: '#666' }}>Pending</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#2980b9' }}>{parcels.filter(p => p.status === 'in_transit' || p.status === 'out_for_delivery').length}</h3>
            <p style={{ color: '#666' }}>In Transit</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#27ae60' }}>{parcels.filter(p => p.status === 'delivered').length}</h3>
            <p style={{ color: '#666' }}>Delivered</p>
          </div>
        </div>

        {parcels.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666', fontSize: '16px' }}>No deliveries assigned to you yet.</p>
            <p style={{ color: '#999', fontSize: '14px' }}>Please wait for the admin to assign parcels.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {parcels.map(p => (
              <div key={p._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#666', margin: '0 0 4px' }}>{p.trackingNumber}</p>
                    <h3 style={{ margin: '0', color: '#2c3e50' }}>{p.recipient.name}</h3>
                  </div>
                  <span className={`badge badge-${p.status}`} style={{ fontSize: '13px', padding: '5px 12px' }}>
                    {p.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 3px' }}>DELIVERY ADDRESS</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#2c3e50' }}>{p.recipient.address}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 3px' }}>PHONE NUMBER</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#2c3e50' }}>
                      <a href={`tel:${p.recipient.phone}`} style={{ color: '#2980b9', textDecoration: 'none' }}>
                        {p.recipient.phone}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 3px' }}>DESCRIPTION</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#2c3e50' }}>{p.description}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 3px' }}>WEIGHT</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#2c3e50' }}>{p.weight} kg</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Update Status:</label>
                  <select
                    value={p.status}
                    onChange={e => updateStatus(p._id, e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer' }}>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', padding: '0' }}>
        ← Back
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {user.name} ({user.role})</h2>
        {(user.role === 'customer' || user.role === 'admin') && (
          <Link to="/create-parcel" className="btn btn-primary">+ Send New Parcel</Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#2c3e50' }}>{parcels.length}</h3>
          <p style={{ color: '#666' }}>Total Parcels</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#f39c12' }}>{parcels.filter(p => p.status === 'pending').length}</h3>
          <p style={{ color: '#666' }}>Pending</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#2980b9' }}>{parcels.filter(p => p.status === 'in_transit').length}</h3>
          <p style={{ color: '#666' }}>In Transit</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#27ae60' }}>{parcels.filter(p => p.status === 'delivered').length}</h3>
          <p style={{ color: '#666' }}>Delivered</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>My Parcels</h3>
        {parcels.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No parcels found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Recipient</th>
                <th>Description</th>
                <th>Status</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map(p => (
                <tr key={p._id}>
                  <td style={{ fontFamily: 'monospace' }}>{p.trackingNumber}</td>
                  <td>{p.recipient.name}</td>
                  <td>{p.description}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status.replace(/_/g, ' ')}</span></td>
                  <td>{p.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;