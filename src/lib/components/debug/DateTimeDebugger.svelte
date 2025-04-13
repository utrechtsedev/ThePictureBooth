<!-- Debugging component for datetime issues -->
<!-- Add this component temporarily to any page to debug datetime issues -->
<script>
  import {
    formatDateDutch,
    extractTimePart,
    extractDatePart,
  } from "$lib/utils/datetime.js";

  // Pass in any date object or string for analysis
  export let dateValue = null;
  export let label = "Date Analysis";

  // Get various representations
  $: originalValue = dateValue;
  $: stringValue = dateValue ? dateValue.toString() : "";
  $: extractedDate = extractDatePart(stringValue);
  $: extractedTime = extractTimePart(stringValue);
  $: formattedDate = formatDateDutch(stringValue);

  // Get browser timezone for reference
  $: browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  $: browserOffset = new Date().getTimezoneOffset() / -60; // Convert to hours and make positive for east
</script>

<div
  class="p-4 border border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg my-4"
>
  <h3 class="font-medium mb-2 text-blue-800 dark:text-blue-300">{label}</h3>

  <div class="space-y-2 text-sm">
    <div>
      <span class="font-medium">Original Value:</span>
      <span class="ml-2 font-mono">{originalValue}</span>
    </div>

    <div>
      <span class="font-medium">String Value:</span>
      <span class="ml-2 font-mono break-all">{stringValue}</span>
    </div>

    <div>
      <span class="font-medium">Extracted Date:</span>
      <span class="ml-2 font-mono">{extractedDate}</span>
    </div>

    <div>
      <span class="font-medium">Extracted Time:</span>
      <span class="ml-2 font-mono">{extractedTime}</span>
    </div>

    <div>
      <span class="font-medium">Formatted Date (Dutch):</span>
      <span class="ml-2 font-mono">{formattedDate}</span>
    </div>

    <div>
      <span class="font-medium">Browser Timezone:</span>
      <span class="ml-2 font-mono"
        >{browserTimezone} (UTC{browserOffset >= 0
          ? "+"
          : ""}{browserOffset})</span
      >
    </div>
  </div>
</div>
