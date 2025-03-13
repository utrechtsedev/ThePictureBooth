const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

class Reservation extends Model {}
Reservation.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,  // Gebruik UUIDV4 voor automatische generatie van een geldige UUID
      primaryKey: true,
      get() {
        const rawValue = this.getDataValue('id');
        return rawValue ? rawValue.toString() : null;
      }
    },
    customer_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    photobooth_id: { 
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
      type: DataTypes.ENUM("deposit_paid", "final_pending", "final_paid"), 
      defaultValue: "deposit_paid" 
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
    Reservation.belongsTo(models.Photobooth, { foreignKey: "photobooth_id" });
    Reservation.hasOne(models.Invoice)
}

module.exports = Reservation;