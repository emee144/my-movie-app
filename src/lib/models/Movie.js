import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movieSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: uuidv4,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      ref: 'User',
      index: true,
    },
  },
  {
    collection: 'movies',
    timestamps: true,
    versionKey: false,
  }
);

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export {Movie};