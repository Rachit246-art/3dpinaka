import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, WhatsappLogo } from '@phosphor-icons/react';
import { cartService, WISHLIST_UPDATED } from '../services/cartService';

const Login = () => {
    const [activeTab, setActiveTab] = useState('signin');
    const [formData, setFormData] = useState({ firstName: '', lastName: '', mobile: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { setCurrentUser(JSON.parse(storedUser)); } catch(e) {}
        }
        fetch('http://localhost:5000/api/auth/users')
            .then(res => res.json())
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));

        setWishlistCount(cartService.getWishlistCount());
        const updateWishlist = () => setWishlistCount(cartService.getWishlistCount());
        window.addEventListener(WISHLIST_UPDATED, updateWishlist);
        window.addEventListener('storage', updateWishlist);

        return () => {
            window.removeEventListener(WISHLIST_UPDATED, updateWishlist);
            window.removeEventListener('storage', updateWishlist);
        };
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess('Successfully logged in! Welcome back, ' + data.user.firstName + '.');
                setCurrentUser(data.user);
                window.dispatchEvent(new Event('storage'));
                setTimeout(() => setSuccess(''), 5000);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error check if server is running');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        
        // Client-side check
        if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
            setError('This email is already registered. Please login.');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Account created! You can now sign in.');
                setActiveTab('signin');
                // Refresh users
                const updatedUsers = await fetch('http://localhost:5000/api/auth/users').then(r => r.json());
                setUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error check if server is running');
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (res.ok) {
                if (data.user.role === 'admin' || data.user.email === 'connect2rachit882@gmail.com') {
                    // Force role to be admin if email matched
                    if (data.user.email === 'connect2rachit882@gmail.com') {
                        data.user.role = 'admin';
                    }
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setSuccess('Successfully logged in as Admin!');
                    setCurrentUser(data.user);
                    window.dispatchEvent(new Event('storage'));
                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                } else {
                    setError('Access denied. You are not an administrator.');
                }
            } else {
                setError(data.message || 'Invalid credentials.');
            }
        } catch (err) {
            setError('Network error check if server is running');
        }
    };

    return (
        <main>
            <div className="auth-wrapper" style={{ backgroundColor: 'var(--light-bg)', padding: '4rem 0', minHeight: 'calc(100vh - 400px)' }}>
                <div className="container">
                    <Link to="/" className="back-home-btn" style={{ marginBottom: '2rem', display: 'inline-block' }}><ArrowLeft /> Back to Home</Link>
                    <div className="auth-container reveal active" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        {currentUser ? (
                            <div className="profile-view" style={{ textAlign: 'center' }}>
                                {success && <div style={{ padding: '12px', background: '#f0fff4', color: '#38a169', border: '1px solid #9ae6b4', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>✅</span> {success}
                                </div>}
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', fontWeight: 'bold' }}>
                                    {(currentUser.firstName ? currentUser.firstName.charAt(0) : currentUser.name?.charAt(0))?.toUpperCase() || 'U'}
                                </div>
                                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>{currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : currentUser.name || 'User'}</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{currentUser.email}</p>
                                
                                {currentUser.role === 'admin' && (
                                    <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ width: '100%', padding: '12px', border: '1px solid var(--primary)', background: 'var(--primary)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginBottom: '1rem' }}>
                                        Go to Admin Dashboard
                                    </button>
                                )}
                                
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ flex: 1, padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>0</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
                                    </div>
                                    <div style={{ flex: 1, padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{wishlistCount}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Wishlist</span>
                                    </div>
                                </div>

                                <button onClick={() => { 
                                    localStorage.removeItem('token'); 
                                    localStorage.removeItem('user'); 
                                    setCurrentUser(null); 
                                    window.dispatchEvent(new Event('storage')); 
                                }} className="btn btn-outline" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="auth-tabs" style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <div 
                                        className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('signin')}
                                        style={{ flex: 1, textAlign: 'center', padding: '1rem', fontWeight: 600, color: activeTab === 'signin' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: activeTab === 'signin' ? '2px solid var(--primary)' : 'none' }}
                                    >
                                        Sign In
                                    </div>
                                    <div 
                                        className={`auth-tab ${activeTab === 'create-account' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('create-account')}
                                        style={{ flex: 1, textAlign: 'center', padding: '1rem', fontWeight: 600, color: activeTab === 'create-account' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: activeTab === 'create-account' ? '2px solid var(--primary)' : 'none' }}
                                    >
                                        Create Account
                                    </div>
                                    <div 
                                        className={`auth-tab ${activeTab === 'admin' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('admin')}
                                        style={{ flex: 1, textAlign: 'center', padding: '1rem', fontWeight: 600, color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: activeTab === 'admin' ? '2px solid var(--primary)' : 'none' }}
                                    >
                                        Admin
                                    </div>
                                </div>

                                {/* Sign In Form */}
                                {activeTab === 'signin' && (
                                    <form className="auth-form active" onSubmit={handleLogin}>
                                        {error && <div style={{ padding: '12px', background: '#fff5f5', color: '#e53e3e', border: '1px solid #feb2b2', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                                        </div>}
                                        {success && <div style={{ padding: '12px', background: '#f0fff4', color: '#38a169', border: '1px solid #9ae6b4', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>✅</span> {success}
                                        </div>}
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Password</label>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                        </div>
                                        <a href="javascript:void(0)" className="forgot-password" style={{ display: 'block', textAlign: 'right', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Forgot password?</a>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
                                    </form>
                                )}

                                {/* Create Account Form */}
                                {activeTab === 'create-account' && (
                                    <form className="auth-form active" onSubmit={handleRegister}>
                                        {error && <div style={{ padding: '12px', background: '#fff5f5', color: '#e53e3e', border: '1px solid #feb2b2', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                                        </div>}
                                        {success && <div style={{ padding: '12px', background: '#f0fff4', color: '#38a169', border: '1px solid #9ae6b4', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>✅</span> {success}
                                        </div>}
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                                <div className="form-group" style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>First Name</label>
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                                </div>
                                                <div className="form-group" style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Last Name</label>
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                                </div>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Mobile Number</label>
                                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Email Address</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                            </div>
                                        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Password</label>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} minLength="6" required />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
                                    </form>
                                )}

                                {/* Admin Form */}
                                {activeTab === 'admin' && (
                                    <form className="auth-form active" onSubmit={handleAdminLogin}>
                                        {error && <div style={{ padding: '12px', background: '#fff5f5', color: '#e53e3e', border: '1px solid #feb2b2', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                                        </div>}
                                        {success && <div style={{ padding: '12px', background: '#f0fff4', color: '#38a169', border: '1px solid #9ae6b4', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>✅</span> {success}
                                        </div>}
                                        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Admin Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter admin email" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>Password</label>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }} required />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <a href="https://wa.me/918299475268" className="whatsapp-float" target="_blank" rel="noreferrer"><WhatsappLogo size={32} /></a>
        </main>
    );
};

export default Login;
