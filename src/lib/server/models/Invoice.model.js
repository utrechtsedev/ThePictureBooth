import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

class Invoice extends Model {};
  Invoice.init(
    {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        reservation_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
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
    Invoice.belongsTo(models.Reservation, {foreignKey: "reservation_id"});
    Invoice.belongsTo(models.Customer, {foreignKey: "customer_id"});
  }

export { Invoice };