import { sequelize } from "../../../lib/server/models/database.js";

export const getRevenueChartData = async () => {
  try {
    const result = {
      week: [],
      month: [],
      quarter: [],
      year: [],
    };

    // WEEKLY DATA - Last 7 days
    try {
      const weeklyQuery = `
        SELECT 
          DATE(payment_date) as date_group,
          SUM(amount) as revenue
        FROM 
          Payments
        WHERE 
          payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
          AND status = 'paid'
          AND deleted_at IS NULL
        GROUP BY 
          date_group
        ORDER BY 
          date_group ASC
      `;

      const weeklyResults = await sequelize.query(weeklyQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Generate expected dates for the last 7 days
      const weeklyDates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = formatDate(date, "day");
        weeklyDates.push({
          date: formattedDate,
          revenue: 0,
          rawDate: formatDateForSQL(date),
        });
      }

      // Merge query results with expected dates
      weeklyResults.forEach((row) => {
        const rowDate = formatDate(new Date(row.date_group), "day");
        const matchingIndex = weeklyDates.findIndex(
          (d) =>
            formatDateForSQL(new Date(d.rawDate)) ===
            formatDateForSQL(new Date(row.date_group)),
        );

        if (matchingIndex !== -1) {
          weeklyDates[matchingIndex].revenue = parseFloat(row.revenue);
        }
      });

      result.week = weeklyDates.map(({ date, revenue }) => ({ date, revenue }));
    } catch (error) {
      console.error("Error fetching weekly data:", error);
      result.week = generateDefaultDates("week");
    }

    // MONTHLY DATA - Last 7 months
    try {
      const monthlyQuery = `
        SELECT 
          DATE_FORMAT(payment_date, '%Y-%m-01') as date_group,
          SUM(amount) as revenue
        FROM 
          Payments
        WHERE 
          payment_date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 6 MONTH), '%Y-%m-01')
          AND status = 'paid'
          AND deleted_at IS NULL
        GROUP BY 
          date_group
        ORDER BY 
          date_group ASC
      `;

      const monthlyResults = await sequelize.query(monthlyQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Generate expected dates for the last 7 months
      const monthlyDates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        // Make sure to set the date to the first day of the month
        date.setDate(1);
        date.setMonth(date.getMonth() - i);

        const formattedDate = formatDate(date, "month");

        // This is important: store the date in YYYY-MM-01 format to match the DB format
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;

        monthlyDates.push({
          date: formattedDate,
          revenue: 0,
          yearMonth: yearMonth,
        });
      }

      // Merge query results with expected dates
      monthlyResults.forEach((row) => {
        // The date_group is already in YYYY-MM-01 format
        const matchingIndex = monthlyDates.findIndex(
          (d) => d.yearMonth === row.date_group,
        );

        if (matchingIndex !== -1) {
          monthlyDates[matchingIndex].revenue = parseFloat(row.revenue);
        }
      });

      result.month = monthlyDates.map(({ date, revenue }) => ({
        date,
        revenue,
      }));
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      result.month = generateDefaultDates("month");
    }

    // QUARTERLY DATA - Last 7 quarters
    try {
      const quarterlyQuery = `
        SELECT 
          CONCAT(YEAR(payment_date), '-Q', QUARTER(payment_date)) as date_group,
          SUM(amount) as revenue
        FROM 
          Payments
        WHERE 
          payment_date >= DATE_SUB(DATE(CONCAT(YEAR(CURDATE()), '-', (QUARTER(CURDATE()) * 3) - 2, '-01')), INTERVAL 6 QUARTER)
          AND status = 'paid'
          AND deleted_at IS NULL
        GROUP BY 
          date_group
        ORDER BY 
          YEAR(payment_date), QUARTER(payment_date)
      `;

      const quarterlyResults = await sequelize.query(quarterlyQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Generate expected dates for the last 7 quarters
      const quarterlyDates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        const currentQuarter = Math.floor(date.getMonth() / 3);
        const currentYear = date.getFullYear();

        // Calculate the target quarter
        let targetQuarter = currentQuarter - i;
        let targetYear = currentYear;

        while (targetQuarter < 0) {
          targetQuarter += 4;
          targetYear--;
        }

        const formattedDate = `Q${targetQuarter + 1} ${targetYear}`;
        quarterlyDates.push({
          date: formattedDate,
          revenue: 0,
          dbKey: `${targetYear}-Q${targetQuarter + 1}`,
        });
      }

      // Merge query results with expected dates
      quarterlyResults.forEach((row) => {
        const matchingIndex = quarterlyDates.findIndex(
          (d) => d.dbKey === row.date_group,
        );

        if (matchingIndex !== -1) {
          quarterlyDates[matchingIndex].revenue = parseFloat(row.revenue);
        }
      });

      result.quarter = quarterlyDates.map(({ date, revenue }) => ({
        date,
        revenue,
      }));
    } catch (error) {
      console.error("Error fetching quarterly data:", error);
      result.quarter = generateDefaultDates("quarter");
    }

    // YEARLY DATA - Last 7 years
    try {
      const yearlyQuery = `
        SELECT 
          YEAR(payment_date) as date_group,
          SUM(amount) as revenue
        FROM 
          Payments
        WHERE 
          payment_date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 6 YEAR), '%Y-01-01')
          AND status = 'paid'
          AND deleted_at IS NULL
        GROUP BY 
          date_group
        ORDER BY 
          date_group ASC
      `;

      const yearlyResults = await sequelize.query(yearlyQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Generate expected dates for the last 7 years
      const yearlyDates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setFullYear(date.getFullYear() - i);
        const formattedDate = date.getFullYear().toString();
        yearlyDates.push({
          date: formattedDate,
          revenue: 0,
          year: date.getFullYear(),
        });
      }

      // Merge query results with expected dates
      yearlyResults.forEach((row) => {
        const matchingIndex = yearlyDates.findIndex(
          (d) => d.year === parseInt(row.date_group),
        );

        if (matchingIndex !== -1) {
          yearlyDates[matchingIndex].revenue = parseFloat(row.revenue);
        }
      });

      result.year = yearlyDates.map(({ date, revenue }) => ({ date, revenue }));
    } catch (error) {
      console.error("Error fetching yearly data:", error);
      result.year = generateDefaultDates("year");
    }

    return result;
  } catch (error) {
    console.error("Error in getRevenueChartData:", error);
    return {
      week: generateDefaultDates("week"),
      month: generateDefaultDates("month"),
      quarter: generateDefaultDates("quarter"),
      year: generateDefaultDates("year"),
    };
  }
};

// Helper function to format dates for display
function formatDate(date, type) {
  if (type === "day") {
    const day = date.getDate();
    // Use Dutch short month format
    const month = date.toLocaleString("nl-NL", { month: "short" });
    return `${day} ${month}`;
  } else if (type === "month") {
    // Use Dutch short month format
    const month = date.toLocaleString("nl-NL", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  } else if (type === "quarter") {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear();
    return `Q${quarter} ${year}`;
  } else {
    // year
    return date.getFullYear().toString();
  }
}

// Helper function to format dates for SQL comparison
function formatDateForSQL(date) {
  return date.toISOString().split("T")[0];
}

// Generate default dates for a given period
function generateDefaultDates(period) {
  const now = new Date();
  const result = [];

  switch (period) {
    case "week":
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        result.push({
          date: formatDate(date, "day"),
          revenue: 0,
        });
      }
      break;

    case "month":
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(1);
        date.setMonth(date.getMonth() - i);
        result.push({
          date: formatDate(date, "month"),
          revenue: 0,
        });
      }
      break;

    case "quarter":
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        const currentQuarter = Math.floor(date.getMonth() / 3);
        date.setMonth(currentQuarter * 3 - i * 3);
        date.setDate(1);
        result.push({
          date: formatDate(date, "quarter"),
          revenue: 0,
        });
      }
      break;

    case "year":
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        result.push({
          date: formatDate(date, "year"),
          revenue: 0,
        });
      }
      break;
  }

  return result;
}
