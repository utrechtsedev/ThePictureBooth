import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";


class Customer extends Model {}
Customer.init(
  {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
  },
  { 
    sequelize,
    modelName: 'Customer',
    tableName: 'Customers',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
}
);

Customer.associate = (models) => {
    Customer.hasMany(models.Reservation)
    Customer.hasMany(models.Review)
    Customer.hasMany(models.Invoice)
}

export { Customer };