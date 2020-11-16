'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS postgis; DELETE FROM spatial_ref_sys WHERE srid <> 4236`);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS postgis;`);
  }
};
