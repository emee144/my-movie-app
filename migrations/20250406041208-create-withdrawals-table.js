export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawals', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(36),  // Assuming UUID for user ID, but without foreign key constraint
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      net: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Completed',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawals');
  },
};
