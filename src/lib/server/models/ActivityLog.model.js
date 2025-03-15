import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

class ActivityLog extends Model {};
  ActivityLog.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        key: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT
        },
        logged_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ActivityLog',
        tableName: 'ActivityLogs',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  ActivityLog.associate = (models) => {
  }

export { ActivityLog };