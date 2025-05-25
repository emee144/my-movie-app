'use client'; // Correctly placed "use client" directive at the top
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MovieDetailPage = () => {
  const { id } = useParams(); // Get the movie id from the URL parameter
  const [movie, setMovie] = useState(null); // To store the movie data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [showVideo, setShowVideo] = useState(false); // State to control video visibility

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/auth/movies/${id}`); // Fetch movie by id from API
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const movieData = await response.json();
        setMovie(movieData); // Set the fetched movie data
      } catch (error) {
        setError(error.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading when finished
      }
    };

    fetchMovieDetails(); // Call the function to fetch the data
  }, [id]); // Fetch data whenever the movie id changes

  if (loading) {
    return <div>Loading movie details...</div>; // Show loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if movie fetch fails
  }

  if (!movie) {
    return <div>Movie not found.</div>; // If no movie data found
  }

  const handleWatchNowClick = () => {
    setShowVideo(true); // Show the video when the "Watch Now" button is clicked
  };

  return (
    <div className="movie-detail">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="my-4">{movie.description}</p>
      <div className="mt-6">
        {/* Watch Now button */}
        <button
          onClick={handleWatchNowClick}
          className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Watch Now
        </button>
      </div>

      {showVideo && (
        <div className="video-container mt-6">
          {/* Embed Vimeo video */}
          <iframe
            src={`https://player.vimeo.com/video/${movie.videoId}?autoplay=1&title=0&byline=0&portrait=0`}
            style={{ border: 'none' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Movie Video"
            className="w-full h-96"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;