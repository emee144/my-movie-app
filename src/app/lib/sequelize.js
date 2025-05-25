import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";

// Load environment variables
dotenv.config({ path: process.cwd() + "/.env.local" });

// Ensure required environment variables are set
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, SECRET_KEY } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error("❌ Missing essential database environment variables (DB_NAME, DB_USER, DB_PASSWORD).");
  process.exit(1); // Exit if critical env variables are missing
}

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST || "localhost",
  port: Number(DB_PORT) || 3306,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: console.log,
});

// ✅ Define the User Model
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  withdrawalMethod: { type: DataTypes.STRING, allowNull: true },
  accountName: { type: DataTypes.STRING, allowNull: true },
  bankName: { type: DataTypes.STRING, allowNull: true },
  accountNumber: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false });

// ✅ Define the Movie Model
const Movie = sequelize.define("Movie", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  videoId: { type: DataTypes.STRING, allowNull: false },
  // Adding a foreign key reference to the User model
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Note: Sequelize will automatically pluralize this
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, { timestamps: true });

// ✅ Connect & Sync Database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

// ✅ Export Sequelize, User Model, and Movie Model
export { sequelize, User, Movie };
export default sequelize;