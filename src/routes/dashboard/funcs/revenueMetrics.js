import { sequelize } from '../../../lib/server/models/database.js';

/**
 * Gets revenue chart data for different time periods with payment_status="final_paid"
 * @param {string} period - 'week', 'month', 'quarter', or 'year'
 * @returns {Promise<Array>} Array of objects with date and revenue properties
 */
export const getRevenueChartData = async (period = 'week') => {
  try {
    let query;
    let dateFormat;
    
    switch (period) {
      case 'week':
        // Last 7 days
        query = `
          SELECT 
            DATE_FORMAT(event_date, '%Y-%m-%d') as date_group,
            SUM(total_price) as revenue
          FROM Reservations
          WHERE 
            payment_status = 'final_paid'
            AND deleted_at IS NULL
            AND event_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
          GROUP BY date_group
          ORDER BY date_group ASC
        `;
        dateFormat = (dateStr) => {
          const date = new Date(dateStr);
          // Format as "1 Mar"
          const day = date.getDate();
          const month = date.toLocaleString('nl-NL', { month: 'short' });
          return `${day} ${month}`;
        };
        break;
        
      case 'month':
        // Last 7 months
        query = `
          SELECT 
            DATE_FORMAT(event_date, '%Y-%m-01') as date_group,
            SUM(total_price) as revenue
          FROM Reservations
          WHERE 
            payment_status = 'final_paid'
            AND deleted_at IS NULL
            AND event_date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 6 MONTH)
          GROUP BY date_group
          ORDER BY date_group ASC
        `;
        dateFormat = (dateStr) => {
          const date = new Date(dateStr);
          // Format as "Mar 2023"
          const month = date.toLocaleString('nl-NL', { month: 'short' });
          const year = date.getFullYear();
          return `${month} ${year}`;
        };
        break;
        
      case 'quarter':
        // Last 7 quarters
        query = `
          SELECT 
            CONCAT(YEAR(event_date), '-', CEIL(MONTH(event_date)/3)) as date_group,
            SUM(total_price) as revenue
          FROM Reservations
          WHERE 
            payment_status = 'final_paid'
            AND deleted_at IS NULL
            AND event_date >= DATE_SUB(LAST_DAY(CURDATE() - INTERVAL DAY(CURDATE())-1 DAY), INTERVAL 6 QUARTER)
          GROUP BY date_group
          ORDER BY date_group ASC
        `;
        dateFormat = (dateStr) => {
          const [year, quarter] = dateStr.split('-');
          return `Q${quarter} ${year}`;
        };
        break;
        
      case 'year':
      default:
        // Last 7 years
        query = `
          SELECT 
            YEAR(event_date) as date_group,
            SUM(total_price) as revenue
          FROM Reservations
          WHERE 
            payment_status = 'final_paid'
            AND deleted_at IS NULL
            AND YEAR(event_date) >= YEAR(CURDATE()) - 6
          GROUP BY date_group
          ORDER BY date_group ASC
        `;
        dateFormat = (dateStr) => dateStr;
        break;
    }
    
    // Execute the query
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
    
    // Process results to the required format
    const chartData = results.map(item => ({
      date: dateFormat(item.date_group),
      revenue: parseFloat(item.revenue || 0)
    }));
    
    // If we have fewer than 7 data points, fill in the missing ones with zeros
    if (chartData.length < 7) {
      const fillerData = [];
      const today = new Date();
      
      switch (period) {
        case 'week':
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            const day = date.getDate();
            const month = date.toLocaleString('nl-NL', { month: 'short' });
            const dateStr = `${day} ${month}`;
            
            if (!chartData.find(item => item.date === dateStr)) {
              fillerData.push({ date: dateStr, revenue: 0 });
            }
          }
          break;
          
        case 'month':
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(today.getMonth() - i);
            
            const month = date.toLocaleString('nl-NL', { month: 'short' });
            const year = date.getFullYear();
            const dateStr = `${month} ${year}`;
            
            if (!chartData.find(item => item.date === dateStr)) {
              fillerData.push({ date: dateStr, revenue: 0 });
            }
          }
          break;
          
        case 'quarter':
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(today.getMonth() - (i * 3));
            
            const quarter = Math.ceil((date.getMonth() + 1) / 3);
            const year = date.getFullYear();
            const dateStr = `Q${quarter} ${year}`;
            
            if (!chartData.find(item => item.date === dateStr)) {
              fillerData.push({ date: dateStr, revenue: 0 });
            }
          }
          break;
          
        case 'year':
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setFullYear(today.getFullYear() - i);
            
            const dateStr = date.getFullYear().toString();
            
            if (!chartData.find(item => item.date === dateStr)) {
              fillerData.push({ date: dateStr, revenue: 0 });
            }
          }
          break;
      }
      
      // Merge and sort the actual data with the filler data
      const mergedData = [...chartData, ...fillerData];
      
      // Sort based on period type
      if (period === 'quarter') {
        mergedData.sort((a, b) => {
          const yearA = parseInt(a.date.split(' ')[1]);
          const yearB = parseInt(b.date.split(' ')[1]);
          if (yearA !== yearB) return yearA - yearB;
          
          const quarterA = parseInt(a.date.split('Q')[1].split(' ')[0]);
          const quarterB = parseInt(b.date.split('Q')[1].split(' ')[0]);
          return quarterA - quarterB;
        });
      } else if (period === 'year') {
        mergedData.sort((a, b) => parseInt(a.date) - parseInt(b.date));
      } else if (period === 'month') {
        mergedData.sort((a, b) => {
          const [monthA, yearA] = a.date.split(' ');
          const [monthB, yearB] = b.date.split(' ');
          const yearDiff = parseInt(yearA) - parseInt(yearB);
          if (yearDiff !== 0) return yearDiff;
          
          const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
          return months.indexOf(monthA.toLowerCase()) - months.indexOf(monthB.toLowerCase());
        });
      } else {
        // For week, use day-month format (so we sort by date)
        mergedData.sort((a, b) => {
          const [dayA, monthA] = a.date.split(' ');
          const [dayB, monthB] = b.date.split(' ');
          
          const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
          const monthDiff = months.indexOf(monthA.toLowerCase()) - months.indexOf(monthB.toLowerCase());
          
          if (monthDiff !== 0) return monthDiff;
          return parseInt(dayA) - parseInt(dayB);
        });
      }
      
      return mergedData.slice(0, 7); // Ensure we only return 7 data points
    }
    
    return chartData;
  } catch (error) {
    console.error("Error fetching revenue chart data:", error);
    // Return empty data on error
    return [
      { date: '1 Mar', revenue: 0 },
      { date: '2 Mar', revenue: 0 },
      { date: '3 Mar', revenue: 0 },
      { date: '4 Mar', revenue: 0 },
      { date: '5 Mar', revenue: 0 },
      { date: '6 Mar', revenue: 0 },
      { date: '7 Mar', revenue: 0 }
    ];
  }
};