// app/movies/MovieEmbed.js
import React from 'react';

const MovieEmbed = ({ videoId }) => {
  return (
    <div className="aspect-w-16 aspect-h-9 w-full max-w-4xl mx-auto">
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
        className="w-full h-full rounded-xl shadow-md"
        style={{ border: 'none' }}  
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Movie Video"
      ></iframe>
    </div>
  );
};

export default MovieEmbed;
