<!-- Add this component temporarily to debug date/time issues -->
<script>
  // Props - pass in the date string or object to debug
  export let value = null;
  export let name = "DateTime";

  // Computed values for debugging
  $: originalValue = value;
  $: stringValue = value ? value.toString() : "";

  $: isoDateRegex = /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/;
  $: jsDateStringRegex = /^\w{3}\s+\w{3}\s+\d{1,2}\s+\d{4}/;
  $: isISOFormat = isoDateRegex.test(stringValue);
  $: isJSDateFormat = jsDateStringRegex.test(stringValue);

  // Try to extract date parts
  $: dateParts = extractDateParts(stringValue);
  $: timeParts = extractTimeParts(stringValue);

  // Helper functions
  function extractDateParts(str) {
    if (!str) return { year: "", month: "", day: "" };

    // ISO format: 2025-04-16T13:00:00
    if (str.includes("T") || /\d{4}-\d{2}-\d{2}/.test(str)) {
      const dateMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        return {
          year: dateMatch[1],
          month: dateMatch[2],
          day: dateMatch[3],
          format: "ISO",
        };
      }
    }

    // JS Date string: Wed Apr 16 2025 13:00:00
    const jsDateMatch = str.match(/\w{3}\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/);
    if (jsDateMatch) {
      // Map month abbreviation to number
      const monthMap = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      return {
        year: jsDateMatch[3],
        month: monthMap[jsDateMatch[1]] || jsDateMatch[1],
        day: String(jsDateMatch[2]).padStart(2, "0"),
        format: "JS Date String",
      };
    }

    return { year: "", month: "", day: "", format: "Unknown" };
  }

  function extractTimeParts(str) {
    if (!str) return { hours: "", minutes: "", seconds: "" };

    // Look for HH:MM:SS pattern anywhere in the string
    const timeMatch = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      return {
        hours: String(timeMatch[1]).padStart(2, "0"),
        minutes: timeMatch[2],
        seconds: timeMatch[3] || "00",
      };
    }

    return { hours: "", minutes: "", seconds: "" };
  }
</script>

<div
  class="my-4 p-4 border border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg text-sm"
>
  <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">
    {name} Debug Info
  </h3>

  <div class="space-y-1">
    <div>
      <span class="font-medium">Original Value:</span>
      <span class="ml-2 font-mono">{originalValue}</span>
    </div>

    <div>
      <span class="font-medium">String Value:</span>
      <span class="ml-2 font-mono break-all">{stringValue}</span>
    </div>

    <div>
      <span class="font-medium">Format Detection:</span>
      <span class="ml-2 font-mono">
        {isISOFormat
          ? "ISO Format"
          : isJSDateFormat
            ? "JS Date String"
            : "Unknown Format"}
      </span>
    </div>

    <div>
      <span class="font-medium">Date Parts:</span>
      <span class="ml-2 font-mono">
        Year: {dateParts.year}, Month: {dateParts.month}, Day: {dateParts.day}
        {dateParts.format ? `(${dateParts.format})` : ""}
      </span>
    </div>

    <div>
      <span class="font-medium">Time Parts:</span>
      <span class="ml-2 font-mono">
        Hours: {timeParts.hours}, Minutes: {timeParts.minutes}, Seconds: {timeParts.seconds}
      </span>
    </div>

    <div>
      <span class="font-medium">ISO Formatted:</span>
      <span class="ml-2 font-mono">
        {dateParts.year
          ? `${dateParts.year}-${dateParts.month}-${dateParts.day}T${timeParts.hours || "00"}:${timeParts.minutes || "00"}:${timeParts.seconds || "00"}`
          : "N/A"}
      </span>
    </div>
  </div>
</div>

