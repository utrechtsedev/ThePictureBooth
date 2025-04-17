// src/lib/server/models/Reservation.model.js
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Reservation extends Model { }
Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    event_location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    final_payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM("not_paid", "final_pending", "final_paid"),
      defaultValue: "not_paid"
    },
    event_type: {
      type: DataTypes.STRING,
      defaultValue: "Onbekend"
    },
    event_duration: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "cancelled", "completed"),
      defaultValue: "pending"
    },
    admin_notes: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservations',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

Reservation.associate = (models) => {
  Reservation.belongsTo(models.Customer, { foreignKey: "customer_id" });
  Reservation.hasOne(models.Photobooth);
  Reservation.hasOne(models.Invoice, { foreignKey: "reservation_id" })
}

export { Reservation };
