'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info on mount to check authentication
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    alert(`Login clicked with email: ${email}`);
    console.log('Logging in with email:', email, 'and password:', password);
    // TODO: Add your login API call here
  };

  const handleNormalSignup = async (e) => {
    e.preventDefault();
    alert(`Sign Up clicked with email: ${email}`);
    console.log('Signing up with email:', email, 'and password:', password);
    // TODO: Add your signup API call here
  };

  if (loading) {
    return <main className="flex justify-center items-center min-h-screen">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center">🎬 Welcome to Flick</h1>
      <p className="mt-4 text-lg text-center">Browse and watch movies to earn rewards!</p>

      {/* Show user info if logged in */}
      {user && (
        <div className="mt-6 p-4 border rounded shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Withdrawal Method:</strong> {user.withdrawalMethod}</p>
          <p><strong>Account Name:</strong> {user.accountName}</p>
          <p><strong>Bank Name:</strong> {user.bankName}</p>
          <p><strong>Account Number:</strong> {user.accountNumber}</p>
          <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {/* Show login/signup form only if NOT logged in */}
      {!user && (
        <div className="mt-6 flex flex-col gap-4 max-w-md w-full">
          {/* Toggle between Login and Signup */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-3 rounded-lg text-lg transition ${isLogin ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-3 rounded-lg text-lg transition ${!isLogin ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-black'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Login/Signup Form */}
          <form
            onSubmit={isLogin ? handleNormalLogin : handleNormalSignup}
            className="flex flex-col gap-4 mt-4"
          >
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

      {/* Explore Movies Button: Show only when logged in */}
      {user && (
        <Link
          href="/movies"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Explore Movies
        </Link>
      )}
    </main>
  );
}
