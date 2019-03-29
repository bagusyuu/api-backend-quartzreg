'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    user_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    employee_code: DataTypes.STRING,
    title: DataTypes.STRING,
    startat: DataTypes.DATE,
    endat: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {});
  Employee.associate = function(models) {
    // associations can be defined here
    Employee.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    Employee.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };
  return Employee;
};