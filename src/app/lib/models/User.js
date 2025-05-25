import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../sequelize';
import { v4 as uuidv4 } from 'uuid';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },  
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false, // Ensure email cannot be null
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address',
      },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false, // Ensure password cannot be null
  },
  withdrawalMethod: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Allow withdrawalMethod to be nullable
  },
  accountName: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Allow accountName to be nullable
  },
  bankName: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Allow bankName to be nullable
  },
  accountNumber: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Allow accountNumber to be nullable
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'users', // Ensure the table name is correct
  timestamps: true, // Ensures createdAt and updatedAt are handled by Sequelize
});

export default User;
