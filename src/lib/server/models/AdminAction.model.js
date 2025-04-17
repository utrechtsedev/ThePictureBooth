import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";


class AdminAction extends Model {};
AdminAction.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        reservation_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        admin_id: { 
            type: DataTypes.UUID, 
            allowNull: false 
        },
        action: { 
            type: DataTypes.ENUM("accepted", "declined", "modified"), 
            allowNull: false 
        },
        note: { 
            type: DataTypes.TEXT 
        },
    },
    { 
        sequelize,
        modelName: 'AdminAction',
        tableName: 'AdminActions',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

AdminAction.associate = (models) => {
};

export { AdminAction };
