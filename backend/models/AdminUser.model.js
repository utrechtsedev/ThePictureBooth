const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

class AdminUser extends Model {};
  AdminUser.init(
    {
      id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true },
      username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
      password_hash: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
      role: { 
        type: DataTypes.ENUM("superadmin", "admin", "moderator"), 
        defaultValue: "admin" 
    },
    },
    {
        sequelize,
        modelName: 'AdminUser',
        tableName: 'AdminUsers',
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
  );

  AdminUser.associate = (models) => {
    
  }

module.exports = AdminUser;