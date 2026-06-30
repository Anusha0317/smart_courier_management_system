import React, { useState } from 'react';
import axios from 'axios';

const TrackParcel = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statusSteps = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setParcel(null);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/parcels/track/${trackingNumber}`);
      setParcel(data);
    } catch (err) {
      setError('Parcel not found. Please check the tracking number.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTrackingNumber('');
    setParcel(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto' }}>
      <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', padding: '0' }}>
        ← Back
      </button>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Track Your Parcel</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          Enter your tracking number to see delivery status
        </p>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number (e.g. SCM...)"
            style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
          {parcel && (
            <button type="button" onClick={handleReset} className="btn btn-danger">
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: '15px' }}>{error}</div>}

      {parcel && (
        <>
          <div className="card" style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>{parcel.trackingNumber}</h3>
                <p style={{ color: '#666' }}>To: {parcel.recipient.name} — {parcel.recipient.address}</p>
              </div>
              <span className={`badge badge-${parcel.status}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                {parcel.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: '#eee', zIndex: 0 }}></div>
              {statusSteps.map((step, i) => {
                const isActive = statusSteps.indexOf(parcel.status) >= i;
                return (
                  <div key={step} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 8px',
                      background: isActive ? '#27ae60' : '#eee',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isActive ? 'white' : '#999', fontWeight: 'bold'
                    }}>{i + 1}</div>
                    <p style={{ fontSize: '11px', color: isActive ? '#27ae60' : '#999' }}>
                      {step.replace(/_/g, ' ')}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <h4 style={{ marginBottom: '10px' }}>Parcel Details</h4>
              <p><strong>Description:</strong> {parcel.description}</p>
              <p><strong>Weight:</strong> {parcel.weight} kg</p>
              {parcel.assignedCourier && <p><strong>Courier:</strong> {parcel.assignedCourier.name}</p>}
              {parcel.estimatedDelivery && (
                <p><strong>Est. Delivery:</strong> {new Date(parcel.estimatedDelivery).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {parcel.statusHistory && parcel.statusHistory.length > 0 && (
            <div className="card" style={{ marginTop: '15px' }}>
              <h4 style={{ marginBottom: '10px' }}>Status History</h4>
              {parcel.statusHistory.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '8px', alignItems: 'center' }}>
                  <span className={`badge badge-${h.status}`}>{h.status.replace(/_/g, ' ')}</span>
                  <span style={{ color: '#666', fontSize: '13px' }}>{new Date(h.updatedAt).toLocaleString()}</span>
                  {h.note && <span style={{ color: '#888', fontSize: '13px' }}>— {h.note}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackParcel;