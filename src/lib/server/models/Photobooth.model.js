import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

class Photobooth extends Model {}
Photobooth.init(
  {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    rental_price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    deposit_amount: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    availability_status: { 
      type: DataTypes.ENUM("available", "unavailable", "maintenance"), 
      defaultValue: "available" 
    },
    reservation_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  },
{ 
    sequelize,
    modelName: 'Photobooth',
    tableName: 'Photobooths',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
}
);

Photobooth.associate = (models) => {
    Photobooth.belongsTo(models.Reservation, {foreignKey: "reservation_id"})    
}

export { Photobooth };
