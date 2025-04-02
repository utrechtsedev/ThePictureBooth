import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";


class Customer extends Model { }
Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING(60), allowNull: false }
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
  Customer.hasMany(models.Reservation, { foreignKey: "customer_id" })
  Customer.hasMany(models.Review, { foreignKey: "customer_id" })
  Customer.hasMany(models.Invoice)
}

export { Customer };
