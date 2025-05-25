export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'username');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'username', {
    type: Sequelize.STRING,
    allowNull: false,
  });
}