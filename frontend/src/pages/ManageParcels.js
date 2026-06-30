import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
    fetchCouriers();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/parcels');
      setParcels(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchCouriers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/couriers');
      setCouriers(data);
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/parcels/${id}/status`, { status });
      setMessage('Status updated!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const updateEstimatedDelivery = async (id, date) => {
    try {
      await axios.put(`http://localhost:5000/api/parcels/${id}/estimated-delivery`, { estimatedDelivery: date });
      setMessage('Estimated delivery date set!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const assignCourier = async (id, courierId) => {
    try {
      await axios.put(`http://localhost:5000/api/parcels/${id}/assign`, { courierId });
      setMessage('Courier assigned!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const deleteParcel = async (id) => {
    if (!window.confirm('Delete this parcel?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/parcels/${id}`);
      setParcels(parcels.filter(p => p._id !== id));
      setMessage('Parcel deleted!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const filteredParcels = parcels.filter(p => {
    const matchesSearch = p.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px 0' }}>
      <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', padding: '0' }}>
        ← Back
      </button>
      <h2 style={{ marginBottom: '20px' }}>Manage All Parcels</h2>
      {message && <div className="alert alert-success">{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '15px', marginBottom: '25px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', color: '#2c3e50' }}>{parcels.length}</h3>
          <p style={{ color: '#666' }}>Total</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', color: '#f39c12' }}>{parcels.filter(p => p.status === 'pending').length}</h3>
          <p style={{ color: '#666' }}>Pending</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', color: '#2980b9' }}>{parcels.filter(p => p.status === 'in_transit').length}</h3>
          <p style={{ color: '#666' }}>In Transit</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', color: '#27ae60' }}>{parcels.filter(p => p.status === 'delivered').length}</h3>
          <p style={{ color: '#666' }}>Delivered</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by tracking number or recipient name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '220px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Tracking No.</th>
              <th>Sender</th>
              <th>Recipient Details</th>
              <th>Parcel Info</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Est. Delivery</th>
              <th>Assign Courier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map(p => (
              <tr key={p._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.trackingNumber}</td>
                <td>{p.sender?.name || 'N/A'}</td>
                <td>
                  <span style={{ fontWeight: '500' }}>{p.recipient.name}</span><br/>
                  <span style={{ fontSize: '12px', color: '#666' }}>{p.recipient.address}</span><br/>
                  <span style={{ fontSize: '12px', color: '#2980b9' }}>📞 {p.recipient.phone}</span><br/>
                  <span style={{ fontSize: '12px', color: '#666' }}>✉️ {p.recipient.email}</span>
                </td>
                <td>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{p.description}</span><br/>
                  <span style={{ fontSize: '12px', color: '#666' }}>{p.weight} kg</span>
                </td>
                <td><span className={`badge badge-${p.status}`}>{p.status.replace(/_/g, ' ')}</span></td>
                <td>
                  <select
                    value={p.status}
                    onChange={e => updateStatus(p._id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', fontSize: '12px' }}>
                    <option value="pending">Pending</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    defaultValue={p.estimatedDelivery ? new Date(p.estimatedDelivery).toISOString().split('T')[0] : ''}
                    onChange={e => updateEstimatedDelivery(p._id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', fontSize: '12px', width: '130px' }}
                  />
                </td>
                <td>
                  <select
                    value={p.assignedCourier?._id || ''}
                    onChange={e => assignCourier(p._id, e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', fontSize: '12px' }}>
                    <option value="">No courier</option>
                    {couriers.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => deleteParcel(p._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 10px', fontSize: '12px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredParcels.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No parcels found</p>
        )}
      </div>
    </div>
  );
};

export default ManageParcels;