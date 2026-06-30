import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const location = useLocation();
  const preselectedRole = location.state?.role || 'customer';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: preselectedRole });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      if (user.role === 'admin') navigate('/manage-parcels');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="Create a password" />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="customer">Customer</option>
              <option value="courier">Courier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;