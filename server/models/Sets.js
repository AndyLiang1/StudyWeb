// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {
    const SetOfCards = sequelize.define('sets',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        numCards: {
          type: DataTypes.INTEGER,
          allowNull: false
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
      SetOfCards.associate = (models) => {
        SetOfCards.hasMany(models.cards, {
          onDelete: "cascade",
        });
      };
    return SetOfCards
  }
  