export default (orm, DataTypes) => {
  const User = orm.define('user', {
    telegramId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    range: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return User;
};
