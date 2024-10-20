import React, { useState } from 'react';
import axios from 'axios';

function Signin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/signin', formData)
        .then(response => {
            const { token, message } = response.data;
            console.log(token);
            
            console.log(message);
            localStorage.setItem('token', token); // Store token in localStorage
        })
        .catch(error => {
            console.error('Signin failed:', error.response.data.message); // Show error message
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
}

export default Signin;
