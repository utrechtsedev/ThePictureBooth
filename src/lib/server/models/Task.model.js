import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

class Task extends Model {};
  Task.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        public_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high"),
            defaultValue: "low",
            allowNull: true,
        }, 
        dueDate: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'Tasks',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  Task.associate = (models) => {
  }

export { Task };
