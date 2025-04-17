import { sequelize } from '$lib/server/database/database.js';
import { models } from '$lib/server/models/';

/**
 * Gets the average star rating from all reviews using Sequelize methods
 * @returns {Promise<Object>} Object containing average rating and count
 */
export const getRatingMetrics = async () => {
  try {
    // Get average and count using Sequelize's aggregation methods
    const averageRating = await models.Review.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('stars')), 'average'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        deleted_at: null
      },
      raw: true
    });

    // Get the distribution of star ratings
    const distribution = await models.Review.findAll({
      attributes: [
        'stars',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        deleted_at: null
      },
      group: ['stars'],
      raw: true
    });

    // Parse the results
    const count = parseInt(averageRating.count || 0, 10);
    const average = averageRating.average !== null
      ? parseFloat(parseFloat(averageRating.average).toFixed(1))
      : 0;

    // Format the distribution into an object
    const starDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    distribution.forEach(item => {
      const stars = item.stars.toString();
      starDistribution[stars] = parseInt(item.count, 10);
    });

    // Calculate percentages
    const percentages = count > 0 ? {
      '5': parseFloat(((starDistribution['5'] / count) * 100).toFixed(1)),
      '4': parseFloat(((starDistribution['4'] / count) * 100).toFixed(1)),
      '3': parseFloat(((starDistribution['3'] / count) * 100).toFixed(1)),
      '2': parseFloat(((starDistribution['2'] / count) * 100).toFixed(1)),
      '1': parseFloat(((starDistribution['1'] / count) * 100).toFixed(1))
    } : {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0
    };

    return {
      average,
      count,
      distribution: starDistribution,
      percentages
    };
  } catch (error) {
    console.error("Error querying review metrics:", error);
    // Return defaults on error
    return {
      average: 0,
      count: 0,
      distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
      percentages: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
    };
  }
};

// Example usage in a load function:
/*
export async function load({ locals }) {
  const reviewMetrics = await getAverageRating();
  
  return {
    user: locals.user || null,
    dashboardData: {
      metrics: {
        averageRating: reviewMetrics.average,
        totalReviews: reviewMetrics.count
      },
      reviewMetrics
    }
  };
}
*/
