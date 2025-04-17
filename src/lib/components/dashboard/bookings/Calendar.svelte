<!-- src/lib/components/dashboard/bookings/Calendar.svelte -->
<script>
  export let filteredBookings = [];
  export let currentMonth;
  export let viewBookingDetails;

  // Import fetch API if needed for API calls
  import { onMount } from "svelte";

  // Helper function to get the status styling class
  function getStatusClass(status) {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  // Navigate to previous month
  function previousMonth() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
    );
  }

  // Navigate to today
  function goToToday() {
    currentMonth = new Date();
  }

  // Navigate to next month
  function nextMonth() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    );
  }

  // Function to format date for mobile display
  function formatDayOfWeek(date) {
    return new Intl.DateTimeFormat("nl-NL", { weekday: "short" }).format(date);
  }

  // Helper function to safely check date equality
  function isSameDate(date1, date2) {
    try {
      if (!date1 || !date2) return false;

      // Ensure we're working with Date objects
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);

      // Check if dates are valid
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

      // Compare year, month, and day only
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    } catch (error) {
      console.error("Date comparison error:", error);
      return false;
    }
  }

  // Determine if we're in mobile view
  let isMobileView = false;

  // Set up a media query listener
  if (typeof window !== "undefined") {
    isMobileView = window.innerWidth < 640;
    window.addEventListener("resize", () => {
      isMobileView = window.innerWidth < 640;
    });
  }

  // Drag and drop functionality
  let draggedBooking = null;
  let dragScrollInterval = null;
  let edgeScrollSpeed = 800; // ms to change month
  let edgeThreshold = 50; // px from edge to trigger scrolling

  // Function to handle drag start
  function handleDragStart(event, booking) {
    draggedBooking = booking;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify(booking));

    // Add some styling to the element being dragged
    event.target.classList.add("opacity-50");
  }

  // Function to handle drag end
  function handleDragEnd(event) {
    event.target.classList.remove("opacity-50");
    clearDragScrollInterval();
  }

  // Function to handle drag over for date cells
  function handleDragOver(event, date) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    // Check if drag position is near edges for month navigation
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;

    clearDragScrollInterval();

    if (mouseX < edgeThreshold) {
      // Near left edge - scroll to previous month
      dragScrollInterval = setTimeout(() => {
        previousMonth();
        clearDragScrollInterval();
      }, edgeScrollSpeed);
    } else if (mouseX > windowWidth - edgeThreshold) {
      // Near right edge - scroll to next month
      dragScrollInterval = setTimeout(() => {
        nextMonth();
        clearDragScrollInterval();
      }, edgeScrollSpeed);
    }
  }

  // Function to clear drag scroll interval
  function clearDragScrollInterval() {
    if (dragScrollInterval) {
      clearTimeout(dragScrollInterval);
      dragScrollInterval = null;
    }
  }

  // Function to extract time (hours and minutes) from a date value
  function extractTimeFromDate(dateValue) {
    try {
      // Handle both string and Date object
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return { hours: 0, minutes: 0 };
      }

      return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
      };
    } catch (error) {
      console.error("Error extracting time:", error);
      return { hours: 0, minutes: 0 };
    }
  }

  // Function to handle drop on a date cell
  async function handleDrop(event, date) {
    event.preventDefault();
    clearDragScrollInterval();

    if (!draggedBooking) return;

    try {
      const bookingData = JSON.parse(event.dataTransfer.getData("text/plain"));

      // Extract the original booking time from the event_date property
      const { hours, minutes } = extractTimeFromDate(bookingData.event_date);

      // Create a new date with the target date but original time
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);

      // Create the update payload
      const updatePayload = {
        id: bookingData.id,
        event_date: newDate.toISOString(), // Full ISO string with proper time
      };

      // Call the API to update the booking
      const response = await fetch("/dashboard/boekingen", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();

      if (response.ok) {
        // Find the booking in the filtered bookings array and update it
        const index = filteredBookings.findIndex(
          (b) => b.id === bookingData.id,
        );
        if (index !== -1) {
          // Update with the actual Date object to maintain consistency
          filteredBookings[index].event_date = newDate;
          filteredBookings = [...filteredBookings]; // Trigger reactivity
        }
      } else {
        console.error("Failed to update booking:", result.message);
        // You could display an error notification here
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }

    draggedBooking = null;
  }

  // Function to handle drag enter - highlight drop target
  function handleDragEnter(event) {
    event.preventDefault();
    event.currentTarget.classList.add("bg-gray-100", "dark:bg-gray-700");
  }

  // Function to handle drag leave - remove highlight
  function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("bg-gray-100", "dark:bg-gray-700");
  }

  // Format time from date object
  function formatTime(dateValue) {
    try {
      if (!dateValue) return "?";

      // Convert to Date object if it's not already
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) return "?";

      return new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Time formatting error:", error);
      return "?";
    }
  }

  onMount(() => {
    // Clean up on component unmount
    return () => {
      clearDragScrollInterval();
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", () => {
          isMobileView = window.innerWidth < 640;
        });
      }
    };
  });
</script>

<div
  class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
>
  <div
    class="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
  >
    <div>
      <h2 class="text-lg font-medium text-gray-900 dark:text-white">
        {new Intl.DateTimeFormat("nl-NL", {
          month: "long",
          year: "numeric",
        }).format(currentMonth)}
      </h2>
    </div>
    <div class="flex space-x-2">
      <button
        on:click={previousMonth}
        class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        on:click={goToToday}
        class="p-1.5 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
      >
        Vandaag
      </button>
      <button
        on:click={nextMonth}
        class="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Desktop View (unchanged) for tablets and larger -->
  <div class="hidden sm:block">
    <div
      class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
    >
      {#each ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"] as day}
        <div
          class="bg-gray-50 dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          {day}
        </div>
      {/each}
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
      {#each Array(35) as _, index}
        {@const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          index -
            new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1,
            ).getDay() +
            1,
        )}
        {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}
        {@const isToday = new Date().toDateString() === date.toDateString()}
        {@const bookingsOnDay = filteredBookings.filter((booking) =>
          isSameDate(booking.event_date, date),
        )}

        <div
          class={`min-h-[100px] p-2 transition-colors ${isCurrentMonth ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900/20"}`}
          on:dragover={(e) => handleDragOver(e, date)}
          on:drop={(e) => handleDrop(e, date)}
          on:dragenter={handleDragEnter}
          on:dragleave={handleDragLeave}
        >
          <div
            class={`text-right ${isToday ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 h-6 w-6 rounded-full flex items-center justify-center ml-auto" : ""} ${isCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
          >
            {date.getDate()}
          </div>

          <div class="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
            {#each bookingsOnDay as booking}
              <div
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, booking)}
                on:dragend={handleDragEnd}
                on:click={() => viewBookingDetails(booking)}
                class="px-2 py-1 text-xs rounded-md truncate cursor-pointer transition-opacity
                                {getStatusClass(booking.status || 'pending')}"
              >
                {formatTime(booking.event_date) || "?"} - {booking.event_type ||
                  "Onbekend"}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Mobile View - 1 column layout with larger day cells -->
  <div class="block sm:hidden">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <div
        class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 text-center"
      >
        Kalender
      </div>
    </div>

    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      {#each Array(35) as _, index}
        {@const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          index -
            new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1,
            ).getDay() +
            1,
        )}
        {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}
        {@const isToday = new Date().toDateString() === date.toDateString()}
        {@const bookingsOnDay = filteredBookings.filter((booking) =>
          isSameDate(booking.event_date, date),
        )}

        {#if isCurrentMonth}
          <div
            class="p-3 bg-white dark:bg-gray-800 transition-colors"
            on:dragover={(e) => handleDragOver(e, date)}
            on:drop={(e) => handleDrop(e, date)}
            on:dragenter={handleDragEnter}
            on:dragleave={handleDragLeave}
          >
            <div class="flex items-center mb-2">
              <div
                class={`flex-shrink-0 ${isToday ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 h-8 w-8 rounded-full flex items-center justify-center" : "text-gray-900 dark:text-white"}`}
              >
                <span class="font-medium">{date.getDate()}</span>
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {formatDayOfWeek(date)}
              </span>
            </div>

            {#if bookingsOnDay.length > 0}
              <div class="space-y-2">
                {#each bookingsOnDay as booking}
                  <div
                    draggable="true"
                    on:dragstart={(e) => handleDragStart(e, booking)}
                    on:dragend={handleDragEnd}
                    on:click={() => viewBookingDetails(booking)}
                    class="p-2 text-sm rounded-md cursor-pointer transition-opacity
                                        {getStatusClass(
                      booking.status || 'pending',
                    )}"
                  >
                    <div class="font-medium">
                      {formatTime(booking.event_date) || "?"} - {booking.event_type ||
                        "Onbekend"}
                    </div>
                    <div class="text-xs mt-1 opacity-80">
                      {booking.customer?.name || ""}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-sm text-gray-400 dark:text-gray-500 py-1">
                Geen boekingen
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

