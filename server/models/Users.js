// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('users',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
      }
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
    , {
      // Other model options go here
    });
    User.associate = (models) => {
      User.hasMany(models.folders, {
        onDelete: "cascade",
      });
      User.hasMany(models.sets, {
        onDelete: "cascade",
      });

    };
  return User
}
