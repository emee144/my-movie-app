'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import Image from 'next/image';
const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState(null);

  useEffect(() => {
    const fetchUserAndMovies = async () => {
      setLoading(true);

      try {
        const authRes = await fetch('/api/auth/user', {
          credentials: 'include',
          cache: 'no-store',
        });

        let userData = null;
        if (authRes.ok) {
          userData = await authRes.json();
          setUser(userData);

          setMoviesLoading(true);
          try {
            const tmdbRes = await fetch(
              'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
              {
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN}`,
                },
                cache: 'no-store',
              }
            );

            if (!tmdbRes.ok) throw new Error('Failed to fetch popular movies');

            const data = await tmdbRes.json();
            setMovies(data.results?.slice(0, 10) || []); 
          } catch (movieErr) {
            console.error(movieErr);
            setMoviesError('Could not load movies at the moment');
          } finally {
            setMoviesLoading(false);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = { email, password };
    const result = authSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setUser(data.user);
    } catch (err) {
      setError(err.message || 'Failed to process request');
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
     
      <div className="relative">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {movies.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
              alt="Hero background"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
        )}

        <div className="relative z-20 container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4"> Welcome to Flick</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl">
            Browse trending movies, watch, and earn rewards — all in one place.
          </p>

          {user ? (
            <div className="w-full max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                Popular Right Now
              </h2>

              {moviesLoading ? (
                <p>Loading popular movies...</p>
              ) : moviesError ? (
                <p className="text-red-400">{moviesError}</p>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="aspect-[2/3] relative">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-400">
                            No Poster
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="mt-1 text-xs text-gray-400 flex justify-between">
                          <span>
                            {movie.release_date
                              ? new Date(movie.release_date).getFullYear()
                              : 'N/A'}
                          </span>
                          <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No popular movies available right now.</p>
              )}

              <div className="mt-10">
                <Link
                  href="/movies"
                  className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition"
                >
                  Explore All Movies →
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isLogin
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    !isLogin
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  className={`py-3 rounded-md font-semibold transition ${
                    isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white`}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-400">
                Join now to start earning rewards by watching movies!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}