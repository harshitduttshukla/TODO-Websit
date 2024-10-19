import axios from 'axios';
import React, { useState } from 'react';

function Signup() {
  const [email, setemail] = useState('');
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !name || !password) {
      setError('All fields are required');
      return;
    }
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        setSuccess('Signup successful');
        console.log(response.data);
        setemail('');
        setname('');
        setpassword('');
      }
    } catch (err) {
      setError('Signup failed. Try again.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 w-full hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
