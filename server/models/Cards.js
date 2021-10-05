// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {

    const Cuecard = sequelize.define('cards',
      {
        question: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        answer: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
      }
      , {
        // Other model options go here
      });
      
    return Cuecard
  }
  