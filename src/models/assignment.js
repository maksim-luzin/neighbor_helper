export default (orm, DataTypes) => {
  const Assignment = orm.define('assignment', {
    authorTelegramId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    description: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    reward: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    link: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    status: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    category: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    spamScore: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pictureUrl: {
      type: DataTypes.VARCHAR,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return Assignment;
};
