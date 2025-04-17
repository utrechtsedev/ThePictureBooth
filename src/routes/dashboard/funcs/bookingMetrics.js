import { sequelize } from '$lib/server/database/database.js';

// Function to get reservation metrics with growth rates
export const getBookingMetrics = async () => {
  try {
    // Raw query to get counts for current and previous periods
    const results = await sequelize.query(`
      SELECT
        -- Current year reservations
        COUNT(CASE WHEN created_at >= CONCAT(YEAR(CURDATE()), '-01-01 00:00:00') THEN 1 ELSE NULL END) AS year_count,
        -- Previous year reservations
        COUNT(CASE WHEN created_at >= CONCAT(YEAR(CURDATE())-1, '-01-01 00:00:00') 
                 AND created_at < CONCAT(YEAR(CURDATE()), '-01-01 00:00:00') THEN 1 ELSE NULL END) AS prev_year_count,
        
        -- Current quarter reservations
        COUNT(CASE WHEN created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-01 00:00:00') THEN 1 ELSE NULL END) AS quarter_count,
        -- Previous quarter reservations (handles year boundary)
        COUNT(CASE WHEN 
                 (QUARTER(CURDATE()) > 1 AND 
                  created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD((QUARTER(CURDATE())-1)*3-2, 2, '0'), '-01 00:00:00') AND
                  created_at < CONCAT(YEAR(CURDATE()), '-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-01 00:00:00'))
                 OR
                 (QUARTER(CURDATE()) = 1 AND
                  created_at >= CONCAT(YEAR(CURDATE())-1, '-10-01 00:00:00') AND
                  created_at < CONCAT(YEAR(CURDATE()), '-01-01 00:00:00'))
                 THEN 1 ELSE NULL END) AS prev_quarter_count,
        
        -- Current month reservations
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE()), 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN 1 ELSE NULL END) AS month_count,
        -- Previous month reservations (handles year boundary)
        COUNT(CASE WHEN 
                 (MONTH(CURDATE()) > 1 AND
                  created_at >= STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE())-1, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE()), 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 OR
                 (MONTH(CURDATE()) = 1 AND
                  created_at >= STR_TO_DATE(CONCAT('01-12-', YEAR(CURDATE())-1, ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 THEN 1 ELSE NULL END) AS prev_month_count,
        
        -- Current week reservations
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN 1 ELSE NULL END) AS week_count,
        -- Previous week reservations
        COUNT(CASE WHEN 
                 created_at >= STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE())+7 DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                 created_at < STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s')
                 THEN 1 ELSE NULL END) AS prev_week_count,
                 
        -- Current year revenue
        SUM(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN total_price ELSE 0 END) AS year_revenue,
        -- Previous year revenue
        SUM(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE())-1, ' 00:00:00'), '%d-%m-%Y %H:%i:%s') 
                 AND created_at < STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN total_price ELSE 0 END) AS prev_year_revenue,
                 
        -- Current quarter revenue
        SUM(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN total_price ELSE 0 END) AS quarter_revenue,
        -- Previous quarter revenue (handles year boundary)
        SUM(CASE WHEN 
                 (QUARTER(CURDATE()) > 1 AND 
                  created_at >= STR_TO_DATE(CONCAT('01-', LPAD((QUARTER(CURDATE())-1)*3-2, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 OR
                 (QUARTER(CURDATE()) = 1 AND
                  created_at >= STR_TO_DATE(CONCAT('01-10-', YEAR(CURDATE())-1, ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 THEN total_price ELSE 0 END) AS prev_quarter_revenue,
                 
        -- Current month revenue
        SUM(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE()), 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN total_price ELSE 0 END) AS month_revenue,
        -- Previous month revenue (handles year boundary)
        SUM(CASE WHEN 
                 (MONTH(CURDATE()) > 1 AND
                  created_at >= STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE())-1, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE()), 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 OR
                 (MONTH(CURDATE()) = 1 AND
                  created_at >= STR_TO_DATE(CONCAT('01-12-', YEAR(CURDATE())-1, ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                  created_at < STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s'))
                 THEN total_price ELSE 0 END) AS prev_month_revenue,
                 
        -- Current week revenue
        SUM(CASE WHEN created_at >= STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') THEN total_price ELSE 0 END) AS week_revenue,
        -- Previous week revenue
        SUM(CASE WHEN 
                 created_at >= STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE())+7 DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') AND
                 created_at < STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s')
                 THEN total_price ELSE 0 END) AS prev_week_revenue,
                 
        -- PENDING RESERVATIONS for each period
        -- Year pending
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-01-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s') 
                   AND status = 'pending' THEN 1 ELSE NULL END) AS year_pending,
        -- Quarter pending
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s')
                   AND status = 'pending' THEN 1 ELSE NULL END) AS quarter_pending,
        -- Month pending
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT('01-', LPAD(MONTH(CURDATE()), 2, '0'), '-', YEAR(CURDATE()), ' 00:00:00'), '%d-%m-%Y %H:%i:%s')
                   AND status = 'pending' THEN 1 ELSE NULL END) AS month_pending,
        -- Week pending
        COUNT(CASE WHEN created_at >= STR_TO_DATE(CONCAT(DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%d-%m-%Y'), ' 00:00:00'), '%d-%m-%Y %H:%i:%s')
                   AND status = 'pending' THEN 1 ELSE NULL END) AS week_pending
      FROM Reservations
      WHERE deleted_at IS NULL
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    // Process results
    if (results && results.length > 0) {
      const row = results[0];

      // Extract counts for current and previous periods
      const yearCount = parseInt(row.year_count || 0, 10);
      const prevYearCount = parseInt(row.prev_year_count || 0, 10);

      const quarterCount = parseInt(row.quarter_count || 0, 10);
      const prevQuarterCount = parseInt(row.prev_quarter_count || 0, 10);

      const monthCount = parseInt(row.month_count || 0, 10);
      const prevMonthCount = parseInt(row.prev_month_count || 0, 10);

      const weekCount = parseInt(row.week_count || 0, 10);
      const prevWeekCount = parseInt(row.prev_week_count || 0, 10);

      // Extract pending counts for each period
      const yearPending = parseInt(row.year_pending || 0, 10);
      const quarterPending = parseInt(row.quarter_pending || 0, 10);
      const monthPending = parseInt(row.month_pending || 0, 10);
      const weekPending = parseInt(row.week_pending || 0, 10);

      // Extract revenue for current and previous periods
      const yearRevenue = parseFloat(row.year_revenue || 0);
      const prevYearRevenue = parseFloat(row.prev_year_revenue || 0);

      const quarterRevenue = parseFloat(row.quarter_revenue || 0);
      const prevQuarterRevenue = parseFloat(row.prev_quarter_revenue || 0);

      const monthRevenue = parseFloat(row.month_revenue || 0);
      const prevMonthRevenue = parseFloat(row.prev_month_revenue || 0);

      const weekRevenue = parseFloat(row.week_revenue || 0);
      const prevWeekRevenue = parseFloat(row.prev_week_revenue || 0);

      // Calculate growth rates (avoid division by zero)
      const yearGrowth = prevYearCount === 0 ? null : ((yearCount - prevYearCount) / prevYearCount) * 100;
      const quarterGrowth = prevQuarterCount === 0 ? null : ((quarterCount - prevQuarterCount) / prevQuarterCount) * 100;
      const monthGrowth = prevMonthCount === 0 ? null : ((monthCount - prevMonthCount) / prevMonthCount) * 100;
      const weekGrowth = prevWeekCount === 0 ? null : ((weekCount - prevWeekCount) / prevWeekCount) * 100;

      // Calculate revenue growth rates
      const yearRevenueGrowth = prevYearRevenue === 0 ? null : ((yearRevenue - prevYearRevenue) / prevYearRevenue) * 100;
      const quarterRevenueGrowth = prevQuarterRevenue === 0 ? null : ((quarterRevenue - prevQuarterRevenue) / prevQuarterRevenue) * 100;
      const monthRevenueGrowth = prevMonthRevenue === 0 ? null : ((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
      const weekRevenueGrowth = prevWeekRevenue === 0 ? null : ((weekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100;

      return {
        bookings: {
          year: {
            count: yearCount,
            previous: prevYearCount,
            growth: yearGrowth !== null ? parseFloat(yearGrowth.toFixed(2)) : null,
            pending: yearPending
          },
          quarter: {
            count: quarterCount,
            previous: prevQuarterCount,
            growth: quarterGrowth !== null ? parseFloat(quarterGrowth.toFixed(2)) : null,
            pending: quarterPending
          },
          month: {
            count: monthCount,
            previous: prevMonthCount,
            growth: monthGrowth !== null ? parseFloat(monthGrowth.toFixed(2)) : null,
            pending: monthPending
          },
          week: {
            count: weekCount,
            previous: prevWeekCount,
            growth: weekGrowth !== null ? parseFloat(weekGrowth.toFixed(2)) : null,
            pending: weekPending
          }
        },
        revenue: {
          year: {
            amount: parseFloat(yearRevenue.toFixed(2)),
            previous: parseFloat(prevYearRevenue.toFixed(2)),
            growth: yearRevenueGrowth !== null ? parseFloat(yearRevenueGrowth.toFixed(2)) : null
          },
          quarter: {
            amount: parseFloat(quarterRevenue.toFixed(2)),
            previous: parseFloat(prevQuarterRevenue.toFixed(2)),
            growth: quarterRevenueGrowth !== null ? parseFloat(quarterRevenueGrowth.toFixed(2)) : null
          },
          month: {
            amount: parseFloat(monthRevenue.toFixed(2)),
            previous: parseFloat(prevMonthRevenue.toFixed(2)),
            growth: monthRevenueGrowth !== null ? parseFloat(monthRevenueGrowth.toFixed(2)) : null
          },
          week: {
            amount: parseFloat(weekRevenue.toFixed(2)),
            previous: parseFloat(prevWeekRevenue.toFixed(2)),
            growth: weekRevenueGrowth !== null ? parseFloat(weekRevenueGrowth.toFixed(2)) : null
          }
        },
        pending: {
          year: yearPending,
          quarter: quarterPending,
          month: monthPending,
          week: weekPending
        }
      };
    } else {
      // Default values if no results
      return {
        bookings: {
          year: { count: 0, previous: 0, growth: null, pending: 0 },
          quarter: { count: 0, previous: 0, growth: null, pending: 0 },
          month: { count: 0, previous: 0, growth: null, pending: 0 },
          week: { count: 0, previous: 0, growth: null, pending: 0 }
        },
        revenue: {
          year: { amount: 0, previous: 0, growth: null },
          quarter: { amount: 0, previous: 0, growth: null },
          month: { amount: 0, previous: 0, growth: null },
          week: { amount: 0, previous: 0, growth: null }
        },
        pending: {
          year: 0,
          quarter: 0,
          month: 0,
          week: 0
        }
      };
    }
  } catch (error) {
    console.error("Error querying reservation metrics:", error);
    // Return defaults on error
    return {
      bookings: {
        year: { count: 0, previous: 0, growth: null, pending: 0 },
        quarter: { count: 0, previous: 0, growth: null, pending: 0 },
        month: { count: 0, previous: 0, growth: null, pending: 0 },
        week: { count: 0, previous: 0, growth: null, pending: 0 }
      },
      revenue: {
        year: { amount: 0, previous: 0, growth: null },
        quarter: { amount: 0, previous: 0, growth: null },
        month: { amount: 0, previous: 0, growth: null },
        week: { amount: 0, previous: 0, growth: null }
      },
      pending: {
        year: 0,
        quarter: 0,
        month: 0,
        week: 0
      }
    }
  }
};
