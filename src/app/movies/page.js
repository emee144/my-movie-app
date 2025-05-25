'use client';

import React, { useEffect, useState } from 'react';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch movies from the API route
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/auth/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data); // Set the movie data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchMovies();
  }, []); // Empty dependency array to run only once when the component mounts

  if (loading) {
    return <div className="text-center py-10">Loading...</div>; // Show loading message while fetching
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>; // Show error if fetching fails
  }

  return (
    <div className="max-w-screen-xl mx-0 mb-8 px-4 py-8 mr-0 bg-black w-full">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Explore Our Movies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="relative w-full h-48">
              {/* Embed Vimeo Video */}
              <iframe
                src={`https://player.vimeo.com/video/${movie.videoId}?title=0&byline=0&portrait=0`}
                className="w-full h-full object-cover rounded-t-lg"
                style={{ border: 'none' }}
                allow="autoplay; fullscreen; picture-in-picture"
                title={movie.title}
              ></iframe>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{movie.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{movie.description}</p>
              <a
                href={`/movies/${movie.id}`} // Correct link to movie detail page
                className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Watch Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;