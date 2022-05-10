'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'admin@gmail.com',
          password: '$2b$10$oJG/SQHCZ6suVVvoXWMokeGx8fEIOAm2YXal3ujfiREqr3mr9YOrG',
          name: 'Admin',
          status: 'admin',
        },
      ],
      {}
    );
  },


  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
