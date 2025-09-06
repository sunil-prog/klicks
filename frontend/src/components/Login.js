import { useState } from 'react';
import axios from 'axios';
import '../App.css';

export default function Login({ onSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const login = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(
                'http://localhost:5000/api/login',
                form,
                { withCredentials: true }
            );
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <form className="auth-form" onSubmit={login}>
            <h2>Login</h2>
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
                required
            />
            <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
            />
            <button type="submit">Login</button>
            {error && <div className="err-msg">{error}</div>}
        </form>
    );
}
