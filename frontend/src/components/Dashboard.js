import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

export default function Dashboard({ user, onLogout }) {
    const [welcome, setWelcome] = useState('');

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/session`, { withCredentials: true })
            .then((res) => {
                setWelcome('Welcome!');
            })
            .catch(() => setWelcome('Welcome!'));
    }, [user]);

    const logout = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
        onLogout();
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div>{welcome}</div>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
