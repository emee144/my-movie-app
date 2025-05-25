export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      videoId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.CHAR(36),  // Define userId as CHAR(36) to match users.id type
        allowNull: false,
        references: {
          model: 'users',
          key: 'id', // Reference the 'id' column in the 'users' table
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movies');
  },
};