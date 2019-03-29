'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ktp: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Employee, {
      foreignKey: 'user_id',
      as: 'employee'
    });
    User.hasMany(models.Friendship, {
      foreignKey: 'user_id',
      as: 'friend'
    });
  };
  return User;
};