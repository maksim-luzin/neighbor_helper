module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('TRUNCATE spatial_ref_sys; '
      + 'INSERT into spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext) '
      + 'values ( 4326, \'epsg\', 4326, \'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs \', '
      + '\'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,'
      + 'AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,'
      + 'AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,'
      + 'AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]\');');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('TRUNCATE spatial_ref_sys; '
      + 'INSERT into spatial_ref_sys (srid, auth_name, auth_srid, proj4text, srtext) '
      + 'values ( 4236, \'epsg\', 4236, \'+proj=longlat +towgs84=-637,-549,-203,0,0,0,0 +no_defs \', '
      + '\'GEOGCS["Hu Tzu Shan",DATUM["Hu_Tzu_Shan",SPHEROID["International 1924",6378388,297,'
      + 'AUTHORITY["EPSG","7022"]],TOWGS84[-637,-549,-203,0,0,0,0],AUTHORITY["EPSG","6236"]],'
      + 'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,'
      + 'AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4236"]]\');');
  },
};
