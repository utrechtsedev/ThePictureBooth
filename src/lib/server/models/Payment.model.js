// src/lib/server/models/Payment.model.js
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Payment extends Model { }
Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reservation_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.ENUM("deposit", "final"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("online", "cash"),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("paid", "pending", "failed"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "Payments",
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

Payment.associate = (models) => {
  Payment.belongsTo(models.Reservation, { foreignKey: "reservation_id" });
  Payment.belongsTo(models.Customer, { foreignKey: "customer_id" })
};

export { Payment };
