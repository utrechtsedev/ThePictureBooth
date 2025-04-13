/**
 * Utility functions for consistent datetime handling without timezone conversion
 */

// Dutch month names for formatting
const DUTCH_MONTHS = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

/**
 * Formats a date string (YYYY-MM-DD) to Dutch format without using Date objects
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date in Dutch format (e.g., "13 april 2025")
 */
export function formatDateDutch(dateStr) {
  if (!dateStr) return "Onbekend";

  // Handle ISO strings that include time
  if (dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) return "Ongeldige datum";

  const day = parseInt(parts[2]);
  const month = parseInt(parts[1]) - 1; // Adjust to 0-based index
  const year = parts[0];

  if (isNaN(day) || isNaN(month) || month < 0 || month > 11) {
    return "Ongeldige datum";
  }

  return `${day} ${DUTCH_MONTHS[month]} ${year}`;
}

/**
 * Extract date part from any datetime string
 * @param {string} datetimeStr - Any datetime string (ISO or custom format)
 * @returns {string} Date part in YYYY-MM-DD format
 */
export function extractDatePart(datetimeStr) {
  if (!datetimeStr) return "";

  // Handle ISO strings with T separator
  if (datetimeStr.includes('T')) {
    return datetimeStr.split('T')[0];
  }

  // Handle SQL datetime format (YYYY-MM-DD HH:MM:SS)
  if (datetimeStr.includes(' ') && datetimeStr.includes('-') && datetimeStr.includes(':')) {
    return datetimeStr.split(' ')[0];
  }

  // If it's already just a date, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(datetimeStr)) {
    return datetimeStr;
  }

  return "";
}

/**
 * Extract time part from any datetime string
 * @param {string} datetimeStr - Any datetime string (ISO or custom format)
 * @returns {string} Time part in HH:MM format
 */
export function extractTimePart(datetimeStr) {
  if (!datetimeStr) return "";

  let timePart = "";

  // Handle ISO strings with T separator
  if (datetimeStr.includes('T')) {
    timePart = datetimeStr.split('T')[1];
  }
  // Handle SQL datetime format (YYYY-MM-DD HH:MM:SS)
  else if (datetimeStr.includes(' ') && datetimeStr.includes(':')) {
    timePart = datetimeStr.split(' ')[1];
  }

  // Extract just HH:MM from the time part
  if (timePart) {
    const timeMatch = timePart.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
      return `${timeMatch[1]}:${timeMatch[2]}`;
    }
  }

  return "";
}

/**
 * Calculate end time based on start time and duration
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} duration - Duration string (e.g., "3u" for 3 hours)
 * @returns {string} End time in HH:MM format
 */
export function calculateEndTime(startTime, duration) {
  if (!startTime || !duration) return "";

  // Extract hours from start time
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  if (isNaN(startHours) || isNaN(startMinutes)) return "";

  // Extract hours from duration (e.g., "3u" → 3)
  const durationMatch = duration.match(/(\d+)u/);
  if (!durationMatch) return "";

  const durationHours = parseInt(durationMatch[1], 10);
  if (isNaN(durationHours)) return "";

  // Calculate end time
  const endHours = (startHours + durationHours) % 24;

  // Format with leading zeros
  return `${String(endHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
}

/**
 * Convert duration to standard format
 * @param {string|number} duration - Duration in various formats
 * @returns {string} Standardized duration (e.g., "3u")
 */
export function standardizeDuration(duration) {
  if (!duration) return "";

  // If it's already in the right format
  if (/^\d+u$/.test(duration)) {
    return duration;
  }

  // Try to extract just the number
  const match = String(duration).match(/(\d+)/);
  if (match && match[1]) {
    const hours = parseInt(match[1], 10);
    if (!isNaN(hours)) {
      return `${hours}u`;
    }
  }

  return "";
}

/**
 * Calculate duration in hours from start and end times
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Duration in hours (rounded to nearest hour)
 */
export function calculateDurationHours(startTime, endTime) {
  if (!startTime || !endTime) return null;

  // Parse the times
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
    return null;
  }

  // Calculate total minutes for each time
  const startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  // Handle if end time is on the next day
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours in minutes
  }

  // Calculate the difference in hours (round to nearest hour)
  return Math.round((endTotalMinutes - startTotalMinutes) / 60);
}

/**
 * Simple function to combine date and time without timezone conversion
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Combined ISO datetime string
 */
export function combineDateAndTime(dateStr, timeStr) {
  if (!dateStr) return null;
  if (!timeStr) timeStr = "00:00";

  // Simply concatenate without timezone conversion
  return `${dateStr}T${timeStr}:00`;
}
