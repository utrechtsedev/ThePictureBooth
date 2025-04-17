import { sequelize } from '$lib/server/database/database.js';

export const getCustomerMetrics = async () => {
  try {
    // Query both current and previous period metrics
    const results = await sequelize.query(`
        SELECT
          -- Current year
          SUM(CASE WHEN created_at >= CONCAT(YEAR(CURDATE()), '-01-01 00:00:00') THEN 1 ELSE 0 END) AS year_count,
          -- Previous year
          SUM(CASE WHEN created_at >= CONCAT(YEAR(CURDATE())-1, '-01-01 00:00:00') 
                   AND created_at < CONCAT(YEAR(CURDATE()), '-01-01 00:00:00') THEN 1 ELSE 0 END) AS prev_year_count,
          
          -- Current quarter
          SUM(CASE WHEN created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-01 00:00:00') THEN 1 ELSE 0 END) AS quarter_count,
          -- Previous quarter (handles year boundary)
          SUM(CASE WHEN 
                   (QUARTER(CURDATE()) > 1 AND 
                    created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD((QUARTER(CURDATE())-1)*3-2, 2, '0'), '-01 00:00:00') AND
                    created_at < CONCAT(YEAR(CURDATE()), '-', LPAD(QUARTER(CURDATE())*3-2, 2, '0'), '-01 00:00:00'))
                   OR
                   (QUARTER(CURDATE()) = 1 AND
                    created_at >= CONCAT(YEAR(CURDATE())-1, '-10-01 00:00:00') AND
                    created_at < CONCAT(YEAR(CURDATE()), '-01-01 00:00:00'))
                   THEN 1 ELSE 0 END) AS prev_quarter_count,
          
          -- Current month
          SUM(CASE WHEN created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(CURDATE()), 2, '0'), '-01 00:00:00') THEN 1 ELSE 0 END) AS month_count,
          -- Previous month (handles year boundary)
          SUM(CASE WHEN 
                   (MONTH(CURDATE()) > 1 AND
                    created_at >= CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(CURDATE())-1, 2, '0'), '-01 00:00:00') AND
                    created_at < CONCAT(YEAR(CURDATE()), '-', LPAD(MONTH(CURDATE()), 2, '0'), '-01 00:00:00'))
                   OR
                   (MONTH(CURDATE()) = 1 AND
                    created_at >= CONCAT(YEAR(CURDATE())-1, '-12-01 00:00:00') AND
                    created_at < CONCAT(YEAR(CURDATE()), '-01-01 00:00:00'))
                   THEN 1 ELSE 0 END) AS prev_month_count,
          
          -- Current week
          SUM(CASE WHEN created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%Y-%m-%d 00:00:00') THEN 1 ELSE 0 END) AS week_count,
          -- Previous week
          SUM(CASE WHEN 
                   created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE())+7 DAY), '%Y-%m-%d 00:00:00') AND
                   created_at < DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), '%Y-%m-%d 00:00:00')
                   THEN 1 ELSE 0 END) AS prev_week_count
        FROM Customers
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

      // Calculate growth rates (avoid division by zero)
      const yearGrowth = prevYearCount === 0 ? null : ((yearCount - prevYearCount) / prevYearCount) * 100;
      const quarterGrowth = prevQuarterCount === 0 ? null : ((quarterCount - prevQuarterCount) / prevQuarterCount) * 100;
      const monthGrowth = prevMonthCount === 0 ? null : ((monthCount - prevMonthCount) / prevMonthCount) * 100;
      const weekGrowth = prevWeekCount === 0 ? null : ((weekCount - prevWeekCount) / prevWeekCount) * 100;

      return {
        year: {
          count: yearCount,
          previous: prevYearCount,
          growth: yearGrowth !== null ? parseFloat(yearGrowth.toFixed(2)) : null
        },
        quarter: {
          count: quarterCount,
          previous: prevQuarterCount,
          growth: quarterGrowth !== null ? parseFloat(quarterGrowth.toFixed(2)) : null
        },
        month: {
          count: monthCount,
          previous: prevMonthCount,
          growth: monthGrowth !== null ? parseFloat(monthGrowth.toFixed(2)) : null
        },
        week: {
          count: weekCount,
          previous: prevWeekCount,
          growth: weekGrowth !== null ? parseFloat(weekGrowth.toFixed(2)) : null
        }
      };
    } else {
      // Default values if no results
      return {
        year: { count: 0, previous: 0, growth: null },
        quarter: { count: 0, previous: 0, growth: null },
        month: { count: 0, previous: 0, growth: null },
        week: { count: 0, previous: 0, growth: null }
      };
    }
  } catch (error) {
    console.error("Error querying customer metrics:", error);
    // Return defaults on error
    return {
      year: { count: 0, previous: 0, growth: null },
      quarter: { count: 0, previous: 0, growth: null },
      month: { count: 0, previous: 0, growth: null },
      week: { count: 0, previous: 0, growth: null }
    };
  }
}
