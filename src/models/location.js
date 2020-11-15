export default (orm, DataTypes) => {
  const Location = orm.define('location', {
    name: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    coordinates: {
      type: DataTypes.Geography,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return Location;
};
