export default { 
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('movies', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.fn('UUID'),  // MySQL UUID generation function
      allowNull: false,
      primaryKey: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('movies', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    });
  }
};