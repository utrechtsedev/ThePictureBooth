import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";


class Expense extends Model { }
Expense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    supplier: { type: DataTypes.STRING, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    deductible: { type: DataTypes.BOOLEAN, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    modelName: 'Expense',
    tableName: 'Expenses',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

Expense.associate = (models) => {
}


export { Expense };
