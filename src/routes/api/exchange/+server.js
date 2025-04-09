import { models } from '$lib/server/models/index.js';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
  try {
    const data = await request.json();
    let id = data.extra1;
    const reservation = await models.Reservation.findOne({ where: { id: id } });
    if (!reservation) {
      return json({ status: "not ok" }, { status: 200 });
    }
    await reservation.update({ payment_status: "final_pending" })
    const customer = await Customer.findOne({ where: { id: reservation.customer_id } })
    if (!customer) {
      return json({ status: "not ok" }, { status: 200 });
    }
    await models.Payment.create({
      reservation_id: reservation.id,
      payment_type: "deposit",
      amount: reservation.deposit_amount,
      method: "online",
      transaction_id: "", // fix this
      payment_date: new Date(),
      status: "paid",
    })

  } catch (error) {

  }



}
