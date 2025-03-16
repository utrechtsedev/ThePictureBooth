export const PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
};

let selectedPeriod = $state(PERIODS.MONTH);

export const getPeriod = () => selectedPeriod;

export const setPeriod = (period) => selectedPeriod = period;
