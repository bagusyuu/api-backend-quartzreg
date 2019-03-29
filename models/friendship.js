'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friendship = sequelize.define('Friendship', {
    user_id: DataTypes.INTEGER,
    friend_id: DataTypes.INTEGER
  }, {});
  Friendship.associate = function(models) {
    // associations can be defined here
    Friendship.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Friendship.belongsTo(models.User, {
      foreignKey: 'friend_id',
      as: 'friend'
    });
  };
  return Friendship;
};