// src/routes/api/notifications/[id]/+server.js
import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

// Mark a notification as read
export async function PATCH({ params }) {
  try {
    const { id } = params;

    const notification = await models.Notification.findByPk(id);

    if (!notification) {
      return json({ message: "Notificatie niet gevonden" }, { status: 404 });
    }

    notification.read = true;
    await notification.save();

    return json({ notification });
  } catch (error) {
    return json(
      { message: "Kon notificatie niet bijwerken", error: error.message },
      { status: 500 },
    );
  }
}

// Delete a notification
export async function DELETE({ params }) {
  try {
    const { id } = params;

    const notification = await models.Notification.findByPk(id);

    if (!notification) {
      return json({ message: "Notificatie niet gevonden" }, { status: 404 });
    }

    await notification.destroy();

    return json({ success: true, message: "Notificatie verwijderd" });
  } catch (error) {
    return json(
      { message: "Kon notificatie niet verwijderen", error: error.message },
      { status: 500 },
    );
  }
}
