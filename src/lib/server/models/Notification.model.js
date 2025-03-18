import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

class Notification extends Model {};
  Notification.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("info", "warning", "success", "other", "error"),
            allowNull: false,
            defaultValue: "other",
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    
    },
    {
        sequelize,
        modelName: 'Notification',
        tableName: 'Notifications',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  Notification.associate = (models) => {
  }

export { Notification };
