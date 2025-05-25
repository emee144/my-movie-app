// src/app/lib/models/movie.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';  // Import the single Sequelize instance

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',  // Reference the 'users' table
      key: 'id',       // Reference the 'id' field in 'users'
    },
    onDelete: 'CASCADE',  // When a user is deleted, their movies are also deleted
  },
}, {
  tableName: 'movies',
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

export { Movie };