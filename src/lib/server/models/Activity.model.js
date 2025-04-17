import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Activity extends Model {};
  Activity.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        type: {
          type: DataTypes.ENUM("booking", "payment", "customer", "review"),
          allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        icon: {
          type: DataTypes.ENUM("calendar", "payment", "person", "star"),
          allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Activity',
        tableName: 'Activities',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  Activity.associate = (models) => {
  }

export { Activity };
