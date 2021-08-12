'use strict';
const md5 = require("md5");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [
      {
        'name': 'Admin1',
        'email' : 'admin1@gmail.com',
        'password': "0192023a7bbd73250516f069df18b500",
        'role': 'admin',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', {}, null);
  }
};
