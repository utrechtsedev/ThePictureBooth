import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Review extends Model {};
  Review.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        stars: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    
    },
    {
        sequelize,
        modelName: 'Review',
        tableName: 'Reviews',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Customer, { foreignKey: "customer_id"})
  }

export { Review };
