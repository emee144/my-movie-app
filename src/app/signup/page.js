'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import CheckUser from '@/components/CheckUser.js'; // keep if you have this component

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token cookie exists to set authentication state
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleNormalLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Set token cookie (you can customize expiry, secure flags, etc)
        document.cookie = `token=${data.token}; path=/;`;
        setIsAuthenticated(true);
        alert("Login successful!");
        // Optionally redirect or reload
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error logging in");
      console.error(error);
    }
  };

  const handleNormalSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Error signing up");
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center">🎬 Welcome to Flick</h1>
      <p className="mt-4 text-lg text-center">Browse and watch movies to earn rewards!</p>

      <CheckUser />

      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        {!isAuthenticated && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-3 rounded-lg text-lg transition ${isLogin ? 'bg-green-600' : 'bg-gray-300'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-3 rounded-lg text-lg transition ${!isLogin ? 'bg-yellow-600' : 'bg-gray-300'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={isLogin ? handleNormalLogin : handleNormalSignup} className="flex flex-col gap-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg text-lg ${isLogin ? 'bg-blue-600' : 'bg-yellow-600'} text-white transition`}
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>
        )}

        <Link
          href="/movies"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Explore Movies
        </Link>
      </div>
    </main>
  );
}