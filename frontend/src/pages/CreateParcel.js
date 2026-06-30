import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateParcel = () => {
  const [form, setForm] = useState({
    recipient: { name: '', email: '', address: '', phone: '' },
    description: '',
    weight: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/parcels', form);
      setSuccess(`Parcel created! Tracking number: ${data.trackingNumber}`);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create parcel');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto' }}>
      <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', padding: '0' }}>
        ← Back
      </button>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Send a Parcel</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>Recipient Details</h3>
          <div className="form-group">
            <label>Recipient Name</label>
            <input
              type="text"
              value={form.recipient.name}
              onChange={e => setForm({...form, recipient: {...form.recipient, name: e.target.value}})}
              required
              placeholder="Full name"
            />
          </div>
          <div className="form-group">
            <label>Recipient Email</label>
            <input
              type="email"
              value={form.recipient.email}
              onChange={e => setForm({...form, recipient: {...form.recipient, email: e.target.value}})}
              required
              placeholder="Email address"
            />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              value={form.recipient.address}
              onChange={e => setForm({...form, recipient: {...form.recipient, address: e.target.value}})}
              required
              placeholder="Full delivery address"
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <div className="form-group">
            <label>Recipient Phone</label>
            <input
              type="text"
              value={form.recipient.phone}
              onChange={e => setForm({...form, recipient: {...form.recipient, phone: e.target.value}})}
              required
              placeholder="Phone number"
            />
          </div>
          <h3 style={{ margin: '15px 0', color: '#555' }}>Parcel Details</h3>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
              placeholder="What is in the parcel?"
            />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              value={form.weight}
              onChange={e => setForm({...form, weight: e.target.value})}
              required
              placeholder="Weight in kg"
              min="0.1"
              step="0.1"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Parcel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateParcel;