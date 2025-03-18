
import { AdminUser } from './AdminUser.model.js';
import { Customer } from './Customer.model.js';
import { Payment } from './Payment.model.js';
import { Photobooth } from './Photobooth.model.js';
import { Reservation } from './Reservation.model.js';
import { AdminAction } from './AdminAction.model.js';
import { Review } from './Review.model.js';
import { ActivityLog } from './ActivityLog.model.js';
import { Invoice } from './Invoice.model.js';
import { Notification } from './Notification.model.js';
import { Task } from './Task.model.js';

const models = {
  AdminAction,
  Review,
  AdminUser,
  Customer,
  Payment,
  Photobooth,
  Reservation,
  ActivityLog,
  Invoice,
  Notification,
  Task
}

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models); // Pass models to associate function
  }
});

// ✅ Exporteer modellen en database
export { models };
