'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Withdrawals', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    });

    await queryInterface.changeColumn('Withdrawals', 'userId', {
      type: Sequelize.UUID,
    });

    await queryInterface.changeColumn('Withdrawals', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
    });

    await queryInterface.changeColumn('Withdrawals', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
    });

    await queryInterface.changeColumn('Withdrawals', 'net', {
      type: Sequelize.DECIMAL(10, 2),
    });

    await queryInterface.changeColumn('Withdrawals', 'status', {
      type: Sequelize.ENUM('Pending', 'Completed', 'Rejected'),
      defaultValue: 'Pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Withdrawals', 'id', {
      type: Sequelize.STRING(36),
    });

    await queryInterface.changeColumn('Withdrawals', 'userId', {
      type: Sequelize.STRING(36),
    });

    await queryInterface.changeColumn('Withdrawals', 'amount', {
      type: Sequelize.FLOAT,
    });

    await queryInterface.changeColumn('Withdrawals', 'tax', {
      type: Sequelize.FLOAT,
    });

    await queryInterface.changeColumn('Withdrawals', 'net', {
      type: Sequelize.FLOAT,
    });

    await queryInterface.changeColumn('Withdrawals', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Completed',
    });
  },
};
