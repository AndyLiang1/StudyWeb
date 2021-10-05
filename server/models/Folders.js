// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, DataTypes) => {

    const FolderOfCards = sequelize.define('folders',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        numSets: {
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
      FolderOfCards.associate = (models) => {
        FolderOfCards.hasMany(models.sets, {
          onDelete: "cascade",
        });
      };
    return FolderOfCards
  }
  