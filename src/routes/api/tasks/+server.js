import { models } from "$lib/server/models/index.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  try {
    const { title, priority, dueDate } = await request.json();
    //    if (!title || !priority || !dueDate) {
    //      return json({ message: "Vul een titel, prioriteit en datum in!" });
    //    }
    const task = await models.Task.create({
      title: title,
      priority: priority,
      dueDate: dueDate,
    });
    return json({ task });
  } catch (error) {
    return json({ message: "Kon taak niet aanmaken", error: error.message });
  }
}

export async function GET({ request }) {
  try {
    const tasks = await models.Task.findAll({where: {completed: false}})
    return json({tasks})
  } catch (error) {
    
  }
}
