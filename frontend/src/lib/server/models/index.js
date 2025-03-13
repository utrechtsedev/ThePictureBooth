
const AdminUser = require('./AdminUser.model');
const Customer = require('./Customer.model');
const Payment = require('./Payment.model');
const Photobooth = require('./Photobooth.model');
const Reservation = require('./Reservation.model');
const AdminAction = require('./AdminAction.model');
const Review = require('./Review.model');
const ActivityLog = require('./ActivityLog.model');
const Invoice = require('./Invoice.model');

const models = {
  AdminAction,
  Review,
  AdminUser,
  Customer,
  Payment,
  Photobooth,
  Reservation,
  ActivityLog,
  Invoice
}

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models); // Pass models to associate function
  }
});

// ✅ Exporteer modellen en database
module.exports = { models };
