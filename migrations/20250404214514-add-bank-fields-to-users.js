export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'withdrawalMethod', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'bankName', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'accountName', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'accountNumber', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'withdrawalMethod');
  await queryInterface.removeColumn('users', 'bankName');
  await queryInterface.removeColumn('users', 'accountName');
  await queryInterface.removeColumn('users', 'accountNumber');
}
