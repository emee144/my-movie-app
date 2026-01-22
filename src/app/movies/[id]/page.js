'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/auth/movies/${id}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const movieData = await response.json();
        setMovie(movieData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div>Loading movie details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  const handleWatchNowClick = () => {
    setShowVideo(true);
  };

  return (
    <div className="movie-detail">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="my-4">{movie.description}</p>

      <div className="mt-6">
        <button
          onClick={handleWatchNowClick}
          className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Watch Now
        </button>
      </div>

      {showVideo && (
        <div className="video-container mt-6">
          <iframe
            src={`https://player.vimeo.com/video/${movie.videoId}?autoplay=1&title=0&byline=0&portrait=0`}
            style={{ border: 'none' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Movie Video"
            className="w-full h-96"
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
