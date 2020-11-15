export default (orm, DataTypes) => {
  const FavoriteAssignment = orm.define('favoriteAssignment', {
    telegramId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return FavoriteAssignment;
};
