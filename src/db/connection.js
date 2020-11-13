import Sequelize from 'sequelize';
import * as developConfig from '../config/dbConfig/configConnection/dbConfigDevelop';

// eslint-disable-next-line no-console
export default new Sequelize(process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL
  : developConfig);
