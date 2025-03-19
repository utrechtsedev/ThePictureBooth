import { Op, Sequelize } from 'sequelize';
import { models } from '../../../lib/server/models/index.js';

export const getRevenueChartData = async (period = 'week') => {
  try {
    const now = new Date();
    let startDate;
    let dateFormat;
    let sequelizeAttributes;

    // Configure query parameters based on period
    switch (period) {
      case 'week':
        // Last 7 days
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        
        sequelizeAttributes = [
          [Sequelize.fn('DATE', Sequelize.col('payment_date')), 'date_group'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
        ];
        
        dateFormat = (date) => {
          const day = date.getDate();
          const month = date.toLocaleString('nl-NL', { month: 'short' });
          return `${day} ${month}`;
        };
        break;
        
      case 'month':
        // Last 7 months
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        startDate.setDate(1);
        
        sequelizeAttributes = [
          [
            Sequelize.fn(
              'DATE_TRUNC', 
              'month', 
              Sequelize.col('payment_date')
            ), 
            'date_group'
          ],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
        ];
        
        dateFormat = (date) => {
          const month = date.toLocaleString('nl-NL', { month: 'short' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        };
        break;
        
      case 'quarter':
        // Last 7 quarters
        startDate = new Date(now);
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate.setMonth(quarterStartMonth - 15);
        startDate.setDate(1);
        
        sequelizeAttributes = [
          [
            Sequelize.fn(
              'DATE_TRUNC', 
              'quarter', 
              Sequelize.col('payment_date')
            ), 
            'date_group'
          ],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
        ];
        
        dateFormat = (date) => {
          const quarter = Math.ceil((date.getMonth() + 1) / 3);
          return `Q${quarter} ${date.getFullYear()}`;
        };
        break;
        
      case 'year':
      default:
        // Last 7 years
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 6);
        startDate.setMonth(0);
        startDate.setDate(1);
        
        sequelizeAttributes = [
          [
            Sequelize.fn(
              'DATE_TRUNC', 
              'year', 
              Sequelize.col('payment_date')
            ), 
            'date_group'
          ],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
        ];
        
        dateFormat = (date) => date.getFullYear().toString();
        break;
    }
    
    // Get revenue data from database
    const results = await models.Payment.findAll({
      attributes: sequelizeAttributes,
      where: {
        payment_date: {
          [Op.gte]: startDate
        },
        status: 'paid',
        deleted_at: null
      },
      group: ['date_group'],
      order: [[Sequelize.col('date_group'), 'ASC']],
      raw: true
    });
    
    // Format results
    const chartData = results.map(item => {
      const date = new Date(item.date_group);
      return {
        date: dateFormat(date),
        revenue: parseFloat(item.revenue || 0)
      };
    });
    
    // Fill in missing data points to ensure we have exactly 7 data points
    const expectedDataPoints = generateExpectedDataPoints(period, now, dateFormat);
    
    // Merge actual data with expected data points
    const mergedData = expectedDataPoints.map(expected => {
      const found = chartData.find(item => item.date === expected.date);
      return found || expected;
    });
    
    return mergedData;
  } catch (error) {
    console.error("Error fetching revenue chart data:", error);
    return generateDefaultData();
  }
};

/**
 * Generate the expected data points based on the period
 */
function generateExpectedDataPoints(period, now, dateFormat) {
  const dataPoints = [];
  
  switch (period) {
    case 'week':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dataPoints.push({
          date: dateFormat(date),
          revenue: 0
        });
      }
      break;
      
    case 'month':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        dataPoints.push({
          date: dateFormat(date),
          revenue: 0
        });
      }
      break;
      
    case 'quarter':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        const currentQuarterMonth = Math.floor(date.getMonth() / 3) * 3;
        date.setMonth(currentQuarterMonth - (i * 3));
        date.setDate(1);
        dataPoints.push({
          date: dateFormat(date),
          revenue: 0
        });
      }
      break;
      
    case 'year':
    default:
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        date.setMonth(0);
        date.setDate(1);
        dataPoints.push({
          date: dateFormat(date),
          revenue: 0
        });
      }
      break;
  }
  
  return dataPoints;
}

/**
 * Generate default data in case of error
 */
function generateDefaultData() {
  const now = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const day = date.getDate();
    const month = date.toLocaleString('nl-NL', { month: 'short' });
    
    result.push({
      date: `${day} ${month}`,
      revenue: 0
    });
  }
  
  return result;
}
