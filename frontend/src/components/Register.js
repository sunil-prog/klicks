import { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Make sure this path is correct

export default function Register({ onSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const register = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/register`,
                form,
                { withCredentials: true }
            );
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <form className="auth-form" onSubmit={register}>
            <h2>Register</h2>
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
                autoComplete="new-password"
                required
            />
            <button type="submit">Register</button>
            {error && <div className="err-msg">{error}</div>}
        </form>
    );
}
