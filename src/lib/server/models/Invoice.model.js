// src/lib/server/models/Invoice/model.js
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Invoice extends Model { }
Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    reservation_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    invoice_type: {
      type: DataTypes.ENUM("deposit", "final"),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM("paid", "unpaid"),
      defaultValue: "unpaid"
    },
    invoice_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pdf_path: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'Invoices',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

Invoice.associate = (models) => {
  Invoice.belongsTo(models.Customer, { foreignKey: "customer_id" });
  Invoice.belongsTo(models.Reservation, { foreignKey: "reservation_id" });
}

export { Invoice };
