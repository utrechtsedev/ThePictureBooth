import { json } from "@sveltejs/kit";
import { models } from "$lib/server/models/index.js";

export async function GET({ request }) {
  try {
    const customers = await models.Customer.findAll({
      attributes: { exclude: ['password'] } // Exclude password from the response for security
    });
    
    return json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    
    return json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    }, { status: 500 });
  }
};
