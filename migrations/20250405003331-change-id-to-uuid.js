export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,  // Automatically generate UUID
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert, you can change it back to INTEGER
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,  // Revert to auto-incrementing integers
    });
  }
};
