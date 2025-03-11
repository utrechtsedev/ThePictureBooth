<script>
    import { TableHandler } from "@vincjo/datatables";
    import { slide, fade } from "svelte/transition";
    import Fuse from "fuse.js";


    function formatDate(dateString) {
        if (!dateString) return "";
        const [date, time] = dateString.split("T");
        const [year, month, day] = date.split("-");
        const formattedTime = time ? time.slice(0, 5) : "00:00";
        return `${day}-${month}-${year.slice(2)} ${formattedTime}`;
    }

    let reservations = [];
    let filteredReservations = [];
    let table;
    let loading = true;
    let searchQuery = "";
    let selectedStatus = "all";
    let sortColumn = "event_date";
    let sortDirection = "desc";
    let fuse;
    let showModal = false;
    let selectedReservation = null;
    let isSaving = false;
    let showDeleteModal = false;
    let reservationToDelete = null;
    let isDeleting = false;

    let showNewBookingModal = false;
    let errorMessage = "";
    let customers = [];
    let filteredCustomers = [];
    let selectedCustomer = null;

    let newBooking = {
        customer_id: "",
        event_location: "",
        event_date: "",
        deposit_amount: "",
        final_payment_amount: "",
        total_price: "",
        event_type: "",
        status: "pending",
        admin_notes: "",
        photobooth_id: "1",
        event_duration: "",
        event_time: "",
        status: "pending",
        payment_status: "deposit_paid"
    };

    async function fetchCustomers() {
        try {
            const res = await fetch(
                "https://thepicturebooth.nl/api/customers",
            );
            if (!res.ok) throw new Error("Kan klanten niet ophalen");
            customers = await res.json();
            filteredCustomers = customers;
        } catch (error) {
            console.error("Fout bij ophalen klanten:", error);
        }
    }

    function openNewBookingModal() {
        showNewBookingModal = true;
        fetchCustomers(); // Haal de klantenlijst op zodra de modal wordt geopend
    }

    function closeNewBookingModal() {
        showNewBookingModal = false;
        searchQuery = "";
        selectedCustomer = null;
        newBooking = {
            customer_id: "",
            event_location: "",
            event_date: "",
            deposit_amount: "",
            final_payment_amount: "",
            total_price: "",
            event_type: "",
            event_duration: "",
            status: "pending",
            admin_notes: "",
        };
        errorMessage = "";
    }

    function filterCustomers() {
        if (!searchQuery.trim()) {
            filteredCustomers = customers;
            return;
        }

        const fuse = new Fuse(customers, {
            keys: ["first_name", "last_name"],
            threshold: 0.3,
        });

        filteredCustomers = fuse
            .search(searchQuery)
            .map((result) => result.item);
    }

    function selectCustomer(customer) {
        selectedCustomer = customer;
        newBooking.customer_id = customer.id;
        searchQuery = `${customer.first_name} ${customer.last_name}`; // Vul het veld in met de geselecteerde naam
        filteredCustomers = []; // Verberg de suggestielijst
    }

    async function saveNewBooking() {
        if (
            !newBooking.customer_id ||
            !newBooking.event_date ||
            !newBooking.event_time ||
            !newBooking.event_location ||
            !newBooking.total_price
        ) {
            errorMessage = "Vul alle verplichte velden in!";
            return;
        }
        // voegt +1 toe aan Event time door rare bug waar ik niet vanaf kom
        newBooking.event_date = newBooking.event_date+'T'+parseInt(parseInt(newBooking.event_time.split(":")[0])+1)+":00:00"
        newBooking.final_payment_amount = parseInt(newBooking.total_price)-parseInt(newBooking.deposit_amount) + ""
        delete newBooking.event_time;
        isSaving = true;
        try {
            const response = await fetch(
                "https://thepicturebooth.nl/api/reservations/vdash",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newBooking),
                },
            );

            if (!response.ok)
                throw new Error("Fout bij het toevoegen van de reservering");

            await response.json();
            await fetchReservations(); // ✅ Vernieuw de tabel

            closeNewBookingModal();
        } catch (error) {
            errorMessage = "Kan reservering niet toevoegen. Probeer opnieuw.";
            console.error(error);
        } finally {
            isSaving = false;
        }
    }

    async function fetchReservations() {
        loading = true;
        try {
            const res = await fetch(
                "https://thepicturebooth.nl/api/reservations",
            );
            if (!res.ok) throw new Error("Failed to fetch reservations");
            let reservationsData = await res.json();

            const custRes = await fetch(
                "https://thepicturebooth.nl/api/customers",
            );
            if (!custRes.ok) throw new Error("Failed to fetch customers");
            const customersData = await custRes.json();

            let customers = customersData.reduce((acc, customer) => {
                acc[customer.id] =
                    `${customer.first_name} ${customer.last_name}`;
                return acc;
            }, {});

            reservations = reservationsData.map((r) => ({
                ...r,
                customer_name: customers[r.customer_id] || "Onbekende klant",
            }));

            filteredReservations = [...reservations]; // Initieel alle reserveringen tonen
            fuse = new Fuse(reservations, {
                keys: ["customer_name", "event_location", "event_date"],
                threshold: 0.3,
            });

            applySorting();
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            loading = false;
        }
    }

    fetchReservations();

    function filterResults() {
        let results = [...reservations];

        // Status filter
        if (selectedStatus !== "all") {
            results = results.filter((r) => r.status === selectedStatus);
        }

        // Zoek filter
        if (searchQuery.trim() !== "" && fuse) {
            const searchResults = fuse.search(searchQuery);
            results = searchResults.map((result) => result.item);
        }

        filteredReservations = results;
        applySorting();
    }

    function applySorting() {
        filteredReservations.sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (sortColumn === "event_date") {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
            if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        table = new TableHandler(filteredReservations, { rowsPerPage: 10 });
    }

    function changeSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "asc";
        }
        applySorting();
    }
    function openEditModal(reservation) {
        if (!reservation) return;

        selectedReservation = {
            ...reservation,
            location: reservation.event_location, // Zorg dat de locatie correct is
            bookingDate: reservation.event_date
                ? reservation.event_date.split("T")[0]
                : "", // YYYY-MM-DD
            bookingTime: reservation.event_date
                ? reservation.event_date.split("T")[1].slice(0, 5)
                : "", // hh:mm
            eventType: reservation.event_type || "",
            status: reservation.status || "pending",
            total_price: reservation.total_price || 0,
            depositAmount: reservation.deposit_amount || 0,
            event_duration: reservation.event_duration,
            finalPaymentAmount: reservation.final_payment_amount || 0,
            payment_status: reservation.payment_status || "deposit_paid",
            adminNotes: reservation.admin_notes || "",
        };

        console.log(
            "Geselecteerde reservering voor bewerken:",
            selectedReservation,
        );
        showModal = true;
    }

    async function saveChanges() {
        if (!selectedReservation || isSaving) return;
        isSaving = true;

        try {
            const updatedDateTime = `${selectedReservation.bookingDate}T${selectedReservation.bookingTime}:00`;

            const res = await fetch(
                `https://thepicturebooth.nl/api/reservations/${selectedReservation.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        event_location: selectedReservation.location,
                        event_date: updatedDateTime,
                        status: selectedReservation.status,
                        total_price:
                            parseFloat(selectedReservation.total_price) || 0,
                        deposit_amount:
                            parseFloat(selectedReservation.depositAmount) || 0,
                        final_payment_amount:
                            parseFloat(
                                selectedReservation.finalPaymentAmount,
                            ) || 0,
                        event_duration: selectedReservation.event_duration,
                        event_type: selectedReservation.eventType,
                        payment_status: selectedReservation.payment_status,
                        admin_notes: selectedReservation.adminNotes,
                    }),
                },
            );

            if (!res.ok) throw new Error("Fout bij opslaan");

            await fetchReservations();
            closeEditModal();
        } catch (error) {
            console.error("Error updating reservation:", error);
            alert(
                "Er is een fout opgetreden bij het opslaan van de reservering.",
            );
        } finally {
            isSaving = false;
        }
    }

    function closeEditModal() {
        showModal = false;
        selectedReservation = null;
    }
    function openDeleteModal(reservation) {
        reservationToDelete = reservation;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        reservationToDelete = null;
    }
    async function deleteReservation() {
        if (!reservationToDelete || isDeleting) return;
        isDeleting = true;

        try {
            const res = await fetch(
                `https://thepicturebooth.nl/api/reservations/${reservationToDelete.id}`,
                {
                    method: "DELETE",
                },
            );

            if (!res.ok) throw new Error("Fout bij verwijderen");

            // Reservering uit de lijst verwijderen
            reservations = reservations.filter(
                (r) => r.id !== reservationToDelete.id,
            );
            filteredReservations = filteredReservations.filter(
                (r) => r.id !== reservationToDelete.id,
            );

            table = new TableHandler(filteredReservations, { rowsPerPage: 10 });

            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting reservation:", error);
            alert(
                "Er is een fout opgetreden bij het verwijderen van de reservering.",
            );
        } finally {
            isDeleting = false;
        }
    }
</script>

<!-- 🔍 Filters & Zoeken -->
<div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
    <input
        type="text"
        class="border px-3 py-2 rounded w-full md:w-1/3"
        bind:value={searchQuery}
        placeholder="🔍 Zoek op naam, locatie, datum..."
        on:input={filterResults}
    />

    <select
        class="border px-3 py-2 rounded w-full md:w-auto"
        bind:value={selectedStatus}
        on:change={filterResults}
    >
        <option value="all">📌 Alle Statussen</option>
        <option value="pending">⏳ In afwachting</option>
        <option value="accepted">✅ Geaccepteerd</option>
        <option value="cancelled">❌ Geannuleerd</option>
        <option value="completed">🏁 Voltooid</option>
    </select>
</div>
<!-- 📅 Responsive, Sorteerbare Reserveringentabel -->
<div class="bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4 p-4">
        <h2 class="text-2xl font-bold text-gray-700">Alle Boekingen</h2>
        <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            on:click={openNewBookingModal}
        >
            +
        </button>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
        {#if loading}
            <div class="animate-pulse">
                <div class="w-full overflow-x-auto">
                    <table
                        class="w-full min-w-[900px] border-collapse text-center"
                    >
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="py-3 px-4">Klant</th>
                                <th class="py-3 px-4">Locatie</th>
                                <th class="py-3 px-4">Datum</th>
                                <th class="py-3 px-4">Status</th>
                                <th class="py-3 px-4">Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each Array(5) as _}
                                <tr class="border-b">
                                    {#each Array(5) as _}
                                        <td class="py-3 px-4">
                                            <div
                                                class="h-4 bg-gray-300 rounded w-3/4 mx-auto"
                                            ></div>
                                        </td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] border-collapse text-center">
                    <thead>
                        <tr class="bg-gray-100">
                            <th
                                class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition"
                                on:click={() => changeSort("customer_name")}
                            >
                                Klant {sortColumn === "customer_name"
                                    ? sortDirection === "asc"
                                        ? "▲"
                                        : "▼"
                                    : ""}
                            </th>
                            <th
                                class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition"
                                on:click={() => changeSort("event_location")}
                            >
                                Locatie {sortColumn === "event_location"
                                    ? sortDirection === "asc"
                                        ? "▲"
                                        : "▼"
                                    : ""}
                            </th>
                            <th
                                class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition"
                                on:click={() => changeSort("event_date")}
                            >
                                Datum {sortColumn === "event_date"
                                    ? sortDirection === "asc"
                                        ? "▲"
                                        : "▼"
                                    : ""}
                            </th>
                            <th
                                class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition"
                                on:click={() => changeSort("status")}
                            >
                                Status {sortColumn === "status"
                                    ? sortDirection === "asc"
                                        ? "▲"
                                        : "▼"
                                    : ""}
                            </th>
                            <th class="py-3 px-4">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if table && table.rows.length > 0}
                            {#each table.rows as row}
                                <tr
                                    class="border-b hover:bg-gray-50 transition"
                                >
                                    <td class="py-3 px-4"
                                        >{row.customer_name}</td
                                    >
                                    <td class="py-3 px-4"
                                        >{row.event_location}</td
                                    >
                                    <td class="py-3 px-4"
                                        >{formatDate(row.event_date)}</td
                                    >
                                    <td class="py-3 px-4">
                                        <span
                                            class="px-3 py-1 rounded text-white text-xs font-semibold"
                                            class:pending={row.status ===
                                                "pending"}
                                            class:accepted={row.status ===
                                                "accepted"}
                                            class:cancelled={row.status ===
                                                "cancelled"}
                                            class:completed={row.status ===
                                                "completed"}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div
                                            class="flex justify-center space-x-2"
                                        >
                                            <button
                                                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                on:click={() =>
                                                    openEditModal(row)}
                                            >
                                                Bewerk
                                            </button>
                                            <button
                                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                on:click={() =>
                                                    openDeleteModal(row)}
                                            >
                                                Verwijder
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {:else}
                            <tr>
                                <td
                                    colspan="5"
                                    class="text-center py-4 text-gray-500"
                                    >Geen reserveringen gevonden.</td
                                >
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
{#if showModal}
    <div
        transition:fade={{ duration: 300 }}
        class="fixed inset-0 bg-black opacity-50 backdrop-blur-md"
    ></div>
    <div
        transition:fade
        class="fixed inset-0 flex justify-center p-4 overflow-y-auto"
    >
        <div
            transition:slide={{ duration: 300 }}
            class="border border-gray-300 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl max-h-screen overflow-y-auto mt-10 md:mt-20 mb-10"
        >
            <h2 class="text-xl font-semibold mb-4">Bewerk Reservering</h2>

            <div class="grid grid-cols-1 gap-4">
                <!-- Locatie -->
                <div>
                    <label for="" class="block text-gray-700 font-medium">Locatie</label>
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={selectedReservation.location}
                        required
                    />
                </div>
            
                <!-- Boekingstijd en Boekingsdatum naast elkaar -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Boekingstijd</label>
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.bookingTime}
                            required
                        >
                            <option value="">Selecteer een tijd</option>
                            {#each Array(24) as _, hour}
                                <option value={hour.toString().padStart(2, "0") + ":00"}>
                                    {hour.toString().padStart(2, "0") + ":00"}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Boekingsdatum</label>
                        <input
                            type="date"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.bookingDate}
                            required
                        />
                    </div>
                </div>
            
                <!-- Type Evenement en Event Duration naast elkaar -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 font-medium">Type Evenement</label>
                        <input
                            type="text"
                            class="w-full border px-3 py-2 rounded"
                            bind:value={selectedReservation.eventType}
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium">Aantal uren</label>
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.event_duration}
                            required
                        >
                            <option value="2 uur">2 uur</option>
                            <option value="3 uur">3 uur</option>
                            <option value="4 uur">4 uur</option>
                            <option value="5 uur">5 uur</option>
                        </select>
                    </div>
                </div>
            
                <!-- Status en Betaalstatus naast elkaar -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Status</label>
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.status}
                            required
                        >
                            <option value="pending">In afwachting</option>
                            <option value="accepted">Geaccepteerd</option>
                            <option value="cancelled">Geannuleerd</option>
                            <option value="completed">Voltooid</option>
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Betaalstatus</label>
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.payment_status}
                            required
                        >
                            <option value="deposit_paid">Aanbetaald</option>
                            <option value="final_pending">Wachten op betaling</option>
                            <option value="final_paid">Betaling Compleet</option>
                        </select>
                    </div>
                </div>
            
                <!-- Totaalprijs, Aanbetaling en Resterend bedrag naast elkaar -->
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Totaalprijs (€)</label>
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.total_price}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Aanbetaling (€)</label>
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.depositAmount}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium">Resterend bedrag (€)</label>
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.finalPaymentAmount}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
            
                <!-- Notities -->
                <div>
                    <label for="" class="block text-gray-700 font-medium">Notities</label>
                    <textarea
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={selectedReservation.adminNotes}
                        rows="3"
                    ></textarea>
                </div>
            </div>
            
            <!-- Knoppen -->
            <div class="flex justify-end mt-4 space-x-2">
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    on:click={closeEditModal}
                >
                    Annuleren
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    on:click={saveChanges}
                    disabled={isSaving}
                >
                    {isSaving ? "Opslaan..." : "Opslaan"}
                </button>
            </div>
        </div>
    </div>
{/if}

{#if showDeleteModal}
    <div
        class="fixed inset-0 bg-black opacity-50 backdrop-blur-md"
        transition:fade={{ duration: 300 }}
    ></div>
    <div
        transition:fade
        class="fixed inset-0 flex justify-center p-4 overflow-y-auto"
    >
        <div
            transition:slide={{ duration: 300 }}
            class="border border-gray-300 bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg overflow-y-auto mt-10 md:mt-20 mb-10 max-h-50"
        >
            <h2 class="text-xl font-semibold mb-4 text-center">
                Weet je het zeker?
            </h2>
            <p class="text-center text-gray-600 mb-4">
                Wil je de reservering van <strong
                    >{reservationToDelete?.customer_name}</strong
                > echt verwijderen? Dit kan niet ongedaan maken.
            </p>

            <div class="flex justify-center space-x-4">
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    on:click={closeDeleteModal}
                >
                    Annuleren
                </button>
                <button
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    on:click={deleteReservation}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Verwijderen..." : "Verwijder"}
                </button>
            </div>
        </div>
    </div>
{/if}

{#if showNewBookingModal}
    <!-- 🔳 Overlay -->
    <div
        transition:fade
        class="fixed inset-0 bg-black opacity-50 backdrop-blur-md"
    ></div>

    <!-- 📌 Modal -->
    <div
        transition:slide
        class="fixed inset-0 flex justify-center p-4 overflow-y-auto"
    >
        <div
            class="border border-gray-300 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl max-h-screen overflow-y-auto mt-10 md:mt-20 mb-10"
        >
            <h2 class="text-xl font-semibold mb-4">
                Nieuwe Reservering Toevoegen
            </h2>

            <div class="grid grid-cols-1 gap-4">
                <!-- Klant Zoeken -->
                <div>
                    <label class="block text-gray-700 font-medium"
                        >Klantnaam</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded"
                        bind:value={searchQuery}
                        on:input={filterCustomers}
                        placeholder="Zoek klant..."
                        required
                    />

                    {#if filteredCustomers.length > 0}
                        <ul
                            class="border rounded mt-1 bg-white max-h-40 overflow-y-auto"
                        >
                            {#each filteredCustomers as customer}
                                <li
                                    class="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    on:click={() => selectCustomer(customer)}
                                >
                                    {customer.first_name}
                                    {customer.last_name}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <!-- Locatie en Photobooth ID naast elkaar -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-medium">Locatie</label>
                            <input
                                type="text"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.event_location}
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium">Photobooth ID</label>
                            <input
                                type="text"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.photobooth_id}
                                required
                            />
                        </div>
                    </div>
                
                    <!-- Type Evenement en Event Duration naast elkaar -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-medium">Type Evenement</label>
                            <input
                                type="text"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.event_type}
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium">Event Duration</label>
                            <select
                                class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                                bind:value={newBooking.event_duration}
                                required
                            >
                                <option value="2 uur">2 uur</option>
                                <option value="3 uur">3 uur</option>
                                <option value="4 uur">4 uur</option>
                                <option value="5 uur">5 uur</option>
                            </select>
                        </div>
                    </div>
                
                    <!-- Boekingstijd en Datum naast elkaar -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="" class="block text-gray-700 font-medium">Boekingstijd</label>
                            <select
                                class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                                bind:value={newBooking.event_time}
                                required
                            >
                                <option value="">Selecteer een tijd</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                                <option value="19:00">19:00</option>
                                <option value="20:00">20:00</option>
                                <option value="21:00">21:00</option>
                                <option value="22:00">22:00</option>
                                <option value="23:00">23:00</option>
                                <option value="00:00">00:00</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium">Datum</label>
                            <input
                                type="date"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.event_date}
                                required
                            />
                        </div>
                    </div>
                
                    <!-- Totaalprijs en Aanbetaling naast elkaar -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 font-medium">Totaalprijs (€)</label>
                            <input
                                type="number"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.total_price}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium">Aanbetaling (€)</label>
                            <input
                                type="number"
                                class="w-full border px-3 py-2 rounded"
                                bind:value={newBooking.deposit_amount}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                
                    <!-- Notities -->
                    <div>
                        <label class="block text-gray-700 font-medium">Notities</label>
                        <textarea
                            class="w-full border px-3 py-2 rounded"
                            bind:value={newBooking.admin_notes}
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </div>

            {#if errorMessage}
                <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
            {/if}

            <div class="flex justify-end mt-4 space-x-2">
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    on:click={closeNewBookingModal}
                >
                    Annuleren
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    on:click={saveNewBooking}
                    disabled={isSaving}
                >
                    {isSaving ? "Opslaan..." : "Opslaan"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .pending {
        background-color: #facc15; /* Geel */
        color: black;
    }

    .accepted {
        background-color: #16a34a; /* Groen */
        color: white;
    }

    .cancelled {
        background-color: #dc2626; /* Rood */
        color: white;
    }

    .completed {
        background-color: #3b82f6; /* Blauw */
        color: white;
    }
</style>
