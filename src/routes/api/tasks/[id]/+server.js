// src/routes/api/tasks/[id]/+server.js
import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function PATCH({ params, request }) {
  try {
    const { id } = params;
    console.log("Updating task with ID:", id);

    // Parse the request body
    const requestBody = await request.json();

    // Get the completed status from the request body
    const { completed } = requestBody;

    // Find the task by ID
    const task = await models.Task.findOne({ where: { public_id: id } });

    // If the task doesn't exist, return a 404
    if (!task) {
      console.log("Task not found:", id);
      return json({ message: "Taak niet gevonden" }, { status: 404 });
    }

    // Update the completed status
    task.completed = completed;
    await task.save();

    console.log("Task updated successfully:", task);

    // Return the updated task
    return json({ task });
  } catch (error) {
    console.error("Error updating task:", error);
    return json(
      { message: "Kon taak niet bijwerken", error: error.message },
      { status: 500 },
    );
  }
}

// Optional: Add DELETE endpoint to remove tasks
export async function DELETE({ params }) {
  try {
    const { id } = params;

    // Find the task by ID
    const task = await models.Task.findByPk(id);

    // If the task doesn't exist, return a 404
    if (!task) {
      return json({ message: "Taak niet gevonden" }, { status: 404 });
    }

    // Delete the task
    await task.destroy();

    return json({ success: true, message: "Taak verwijderd" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return json(
      { message: "Kon taak niet verwijderen", error: error.message },
      { status: 500 },
    );
  }
}
