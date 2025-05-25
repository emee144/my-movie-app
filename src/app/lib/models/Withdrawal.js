import sequelize from "../sequelize"; // Import the Sequelize instance
import { DataTypes } from "sequelize";

const Withdrawal = sequelize.define(
  "Withdrawal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    
    userId: {
      type: DataTypes.UUID,  // UUID for user ID, but no foreign key constraint
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL to match migration
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL to match migration
      allowNull: false,
    },
    net: {
      type: DataTypes.DECIMAL(10, 2), // Changed to DECIMAL to match migration
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Completed", // Default status
    },
  },
  {
    timestamps: true,
    tableName: 'withdrawals', // Explicitly set table name to match migration
  }
);

export default Withdrawal;
