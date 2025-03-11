<script>
    import { TableHandler } from "@vincjo/datatables";
    import { slide, fade } from "svelte/transition";
    import { format } from "date-fns";
    let reservations = [];
    let customers = {};
    let totalBookings = 0;
    let totalRevenue = 0;
    let upcomingBookings = 0;
    let editedMailUpdate = false;
    let createdMailUpdate = false;
    let newBookings = 0;
    let table;
    let showModal = false;
    let selectedReservation = null;
    let isSaving = false; // Om dubbele updates te voorkomen
    let loading = true;
    function formatDate(dateString) {
        if (!dateString) return "Geen datum";

        const [date, time] = dateString.split("T");
        const [year, month, day] = date.split("-");
        const formattedTime = time ? time.slice(0, 5) : "00:00"; // Haal hh:mm eruit

        return `${day}-${month}-${year.slice(2)} ${formattedTime}`;
    }

    async function loadReservations() {
        loading = true; // ✅ Zet loading op true voor elke nieuwe laadbeurt
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

            customers = customersData.reduce((acc, customer) => {
                acc[customer.id] =
                    `${customer.first_name} ${customer.last_name}`;
                return acc;
            }, {});

            totalBookings = reservationsData.length;
            totalRevenue = reservationsData.reduce(
                (sum, r) => sum + Number(r.total_price),
                0,
            );
            upcomingBookings = reservationsData.filter(
                (r) =>
                    r.status === "accepted" &&
                    new Date(r.event_date) > new Date(),
            ).length;
            newBookings = reservationsData.filter(
                (r) => r.status === "pending",
            ).length;

            let pendingReservations = reservationsData.filter(
                (r) => r.status === "pending",
            );

            reservations = pendingReservations.map((r) => {
                const [year, month, day] = r.event_date
                    .split("T")[0]
                    .split("-");
                const formattedDate = `${day}-${month}-${year.slice(2)}`;
                const time = r.event_date.split("T")[1]
                    ? r.event_date.split("T")[1].substring(0, 5)
                    : "00:00";

                return {
                    id: r.id,
                    name: customers[r.customer_id] || "Onbekende klant",
                    customer_id: r.customer_id,
                    photobooth_id: r.photobooth_id,
                    location: r.event_location,
                    bookingDate: formattedDate, // ✅ Correcte weergave
                    bookingTime: time, // ✅ Correcte tijd
                    eventType: r.event_type,
                    status: r.status,
                    total_price: r.total_price,
                    event_duration: r.event_duration,
                    payment_status: r.payment_status,
                    depositAmount: r.deposit_amount,
                    finalPaymentAmount: r.final_payment_amount,
                    adminNotes: r.admin_notes || "",
                };
            });

            // ✅ Simuleer laadtijd zodat skeleton zichtbaar blijft

            table = new TableHandler(reservations, { rowsPerPage: 50 });
            loading = false; // ✅ Zet altijd loading op false, zelfs als er GEEN data is
        } catch (error) {
            console.error("Error fetching reservations or customers:", error);
        } finally {
            // Verplaats het einde van de loading state naar hier
            if (reservations.length > 0) {
                loading = false;
            }
        }
    }
    loadReservations();
    function openEditModal(reservation) {
        const [day, month, year] = reservation.bookingDate.split("-");
        const formattedDate = `20${year}-${month}-${day}`; // Zet om naar YYYY-MM-DD voor <input type="date">
        let time =
            1 +
            parseInt(reservation.bookingTime.padStart(5, "0").split(":")[0]) +
            ":" +
            reservation.bookingTime.padStart(5, "0").split(":")[1]; // Zorg dat tijd in hh:mm blijft

        if (time === "24:00") {
            time = "00:00";
        }

        selectedReservation = {
            ...reservation,
            bookingDate: formattedDate, // Correcte datum voor input veld
            bookingTime: time, // Correcte tijd voor input veld
        };
        showModal = true;
    }
    function updateStatistics() {
        totalBookings = reservations.length;
        totalRevenue = reservations.reduce(
            (sum, r) => sum + (Number(r.total_price) || 0),
            0,
        );
        upcomingBookings = reservations.filter(
            (r) =>
                r.status === "accepted" && new Date(r.event_date) > new Date(),
        ).length;
        newBookings = reservations.filter((r) => r.status === "pending").length;
    }
    function closeEditModal() {
        showModal = false;
        selectedReservation = null;
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
                        event_type: selectedReservation.eventType,
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
                        payment_status: selectedReservation.payment_status,
                        admin_notes: selectedReservation.adminNotes,
                    }),
                },
            );
            if (!res.ok) throw new Error("Fout bij opslaan");

            const updatedReservation = await res.json();

            // ✅ Werk de reservering bij in de lijst
            reservations = reservations.map((r) =>
                r.id === updatedReservation.id
                    ? {
                          ...r,
                          bookingDate: formatDate(
                              updatedReservation.event_date,
                          ), // ✅ Correcte datum
                          bookingTime: updatedReservation.event_date
                              .split("T")[1]
                              .substring(0, 5), // ✅ Correcte tijd
                      }
                    : r,
            );
            if (editedMailUpdate) {
                await fetch(
                    `https://thepicturebooth.nl/api/reservations/email`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: selectedReservation.id,
                        }),
                    },
                );
            }

            // ✅ **Forceer een update door de tabel opnieuw te laden**
            await loadReservations();

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
    // --- Nieuwe code voor het toevoegen van een reservering en klant in één form ---
    let showAddModal = false;
    let newEntry = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        photobooth_id: "1",
        event_date: "",
        event_time: "",
        event_location: "",
        event_type: "",
        event_duration: "",
        totalPrice: "",
        depositAmount: "",
        finalPaymentAmount: "",
        status: "pending",
        adminNotes: "",
        payment_status: "final_pending",
    };

    function openAddModal() {
        showAddModal = true;
    }

    function closeAddModal() {
        showAddModal = false;
        newEntry = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            photobooth_id: "1",
            event_date: "",
            event_time: "",
            event_location: "",
            event_duration: "",
            totalPrice: "",
            depositAmount: "",
            finalPaymentAmount: "",
            status: "pending",
            adminNotes: "",
        };
    }
    async function saveNewEntry() {
        try {
            // Maak eerst de klant aan via de /api/customers route
            const custRes = await fetch(
                "https://thepicturebooth.nl/api/customers",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        first_name: newEntry.firstName,
                        last_name: newEntry.lastName,
                        email: newEntry.email,
                        phone: newEntry.phone,
                    }),
                },
            );
            if (!custRes.ok)
                throw new Error("Fout bij het aanmaken van de klant");
            const createdCustomer = await custRes.json();
            const customerId =
                createdCustomer.id && createdCustomer.id.val
                    ? createdCustomer.id.val
                    : createdCustomer.id;

            // Gebruik het klant-ID van de aangemaakte klant voor de reservering
            // Merk op dat we nu de reservering aanmaken via de /api/reservations route
            const resRes = await fetch(
                "https://thepicturebooth.nl/api/reservations/vdash",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer_id: customerId, // Dit is de klant-ID (UUID) die is aangemaakt
                        photobooth_id: newEntry.photobooth_id,
                        event_date:
                            newEntry.event_date +
                            "T" +
                            newEntry.event_time +
                            ":00",
                        event_location: newEntry.event_location,
                        total_price: parseFloat(newEntry.totalPrice) || 0,
                        deposit_amount: parseFloat(newEntry.depositAmount) || 0,
                        final_payment_amount:
                            parseFloat(newEntry.finalPaymentAmount) || 0,
                        event_type: newEntry.event_type,
                        event_duration: newEntry.event_duration,
                        status: newEntry.status,
                        admin_notes: newEntry.adminNotes,
                        payment_status: newEntry.payment_status,
                    }),
                },
            );
            if (!resRes.ok)
                throw new Error("Fout bij het aanmaken van de reservering");
            const createdReservation = await resRes.json();
            if (createdMailUpdate) {
                await fetch(
                    `https://thepicturebooth.nl/api/reservations/email`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: createdReservation.id,
                        }),
                    },
                );
            }


            // Indien de nieuwe reservering de status 'pending' heeft, voeg deze dan toe aan de lokale lijst
            if (createdReservation.status === "pending") {
                const newResObj = {
                    id: createdReservation.id,
                    name: `${newEntry.firstName} ${newEntry.lastName}`,
                    customer_id: createdCustomer.id,
                    photobooth_id: createdReservation.photobooth_id,
                    location: createdReservation.event_location,
                    bookingDate: new Date(createdReservation.event_date)
                        .toISOString()
                        .split("T")[0],
                    status: createdReservation.status,
                    event_duration: createdReservation.event_duration,
                    total_price: createdReservation.total_price,
                    depositAmount: createdReservation.deposit_amount,
                    finalPaymentAmount: createdReservation.final_payment_amount,
                    adminNotes: createdReservation.admin_notes || "",
                };

                reservations = [...reservations, newResObj];

                updateStatistics();

                loadReservations();
            }

            closeAddModal();
        } catch (error) {
            console.error("Error creating new entry:", error);
            alert(
                "Er is een fout opgetreden bij het toevoegen van de reservering en klant.",
            );
        }
    }
</script>

<!-- Bestaande statistiek cards -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {#if loading}
        {#each Array(4) as _}
            <div
                class="bg-white rounded-lg shadow p-4 animate-pulse min-h-[100px]"
            >
                <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div class="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
        {/each}
    {:else}
        {#each [{ label: "Totale boekingen", value: totalBookings }, { label: "Totale omzet", value: `€${totalRevenue.toFixed(2)}` }, { label: "Opkomende boekingen", value: upcomingBookings }, { label: "Nieuwe boekingen", value: newBookings }] as card}
            <div class="bg-white rounded-lg shadow p-4 min-h-[100px]">
                <h3 class="text-sm font-medium text-gray-500">{card.label}</h3>
                <p class="mt-2 text-3xl font-semibold text-gray-800">
                    {card.value}
                </p>
            </div>
        {/each}
    {/if}
</div>

<!-- Header met plus-knop -->

<!-- Tabel -->
<div class="bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4 p-4">
        <h2 class="text-2xl font-bold text-gray-700">
            Openstaande reserveringen
        </h2>
        <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            on:click={openAddModal}
        >
            +
        </button>
    </div>

    <div class="w-full overflow-x-auto block">
        <table class="w-full min-w-[900px] border-collapse">
            <thead>
                <tr class="border-b bg-gray-50">
                    <th class="py-3 px-4 font-medium text-center">Naam</th>
                    <th class="py-3 px-4 font-medium text-center">Locatie</th>
                    <th class="py-3 px-4 font-medium text-center"
                        >Boekingsdatum</th
                    >
                    <th class="py-3 px-4 font-medium text-center">Betaald</th>
                    <th class="py-3 px-4 font-medium text-center">Status</th>
                    <th class="py-3 px-4 font-medium text-center"
                        >Bewerk / Bekijk</th
                    >
                </tr>
            </thead>
            <tbody>
                {#if loading}
                    {#each Array(5) as _, i}
                        <tr class="border-b animate-pulse">
                            {#each Array(5) as _, j}
                                <td class="py-4 px-4 text-center">
                                    <div
                                        class="h-4 bg-gray-300 rounded w-3/4 mx-auto"
                                    ></div>
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {:else if table && table.rows.length > 0}
                    {#each table.rows as row}
                        <tr
                            class="border-b odd:bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <td class="py-3 px-4 text-center">{row.name}</td>
                            <td class="py-3 px-4 text-center">{row.location}</td
                            >
                            <td class="py-3 px-4 text-center"
                                >{row.bookingDate + " " + row.bookingTime}</td
                            >
                            {#if row.payment_status == "final_pending"}
                                <td class="py-3 px-4 text-center">
                                    <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 0 36 36"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        class="iconify iconify--twemoji"
                                        preserveAspectRatio="xMidYMid meet"
                                        ><circle
                                            fill="#DD2E44"
                                            cx="18"
                                            cy="18"
                                            r="18"
                                        ></circle></svg
                                    >
                                </td>
                            {:else}
                                <td class="py-3 px-4 text-center">
                                    <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 0 36 36"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        class="iconify iconify--twemoji"
                                        preserveAspectRatio="xMidYMid meet"
                                        ><circle
                                            fill="#78B159"
                                            cx="18"
                                            cy="18"
                                            r="18"
                                        ></circle></svg
                                    >
                                </td>
                            {/if}
                            <td
                                class="py-3 px-4 text-center text-yellow-600 font-medium"
                                >In afwachting</td
                            >
                            <td class="py-3 px-4 text-center">
                                <button
                                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    on:click={() => openEditModal(row)}
                                >
                                    Open
                                </button>
                            </td>
                        </tr>
                    {/each}
                {:else if !loading && (!table || table.rows.length === 0)}
                    <tr>
                        <td colspan="5" class="text-center py-6 text-gray-500"
                            >Geen reserveringen gevonden</td
                        >
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<!-- Bestaande bewerk-modal -->
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
                <!-- Locatie (alleen) -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Locatie</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={selectedReservation.location}
                        required
                    />
                </div>

                <!-- Boekingsdag en Boekingstijd naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Boekingsdatum -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Boekingsdatum</label
                        >
                        <input
                            type="date"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.bookingDate}
                            required
                        />
                    </div>

                    <!-- Boekingstijd -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Boekingstijd</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.bookingTime}
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
                </div>

                <!-- Type evenement en Status naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Type evenement -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Type evenement</label
                        >
                        <input
                            type="text"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.eventType}
                            required
                        />
                    </div>

                    <!-- Status -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Status</label
                        >
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
                </div>

                <!-- Prijs & Betaling (3 kolommen) -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Totaalprijs -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Totaalprijs (€)</label
                        >
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.total_price}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <!-- Aanbetaling -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Aanbetaling (€)</label
                        >
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.depositAmount}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <!-- Resterend bedrag -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Resterend bedrag (€)</label
                        >
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

                <!-- Betaalstatus en Event Duration naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Betaalstatus -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Betaalstatus</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.payment_status}
                            required
                        >
                            <option value="deposit_paid">Aanbetaald</option>
                            <option value="final_pending">Niet betaald</option>
                            <option value="final_paid">Betaling Compleet</option
                            >
                        </select>
                    </div>

                    <!-- Event Duration -->
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Aantal uur</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={selectedReservation.event_duration}
                            required
                        >
                            <option value="">Selecteer duur</option>
                            <option value="2">2 uur</option>
                            <option value="3">3 uur</option>
                            <option value="4">4 uur</option>
                            <option value="5">5 uur</option>
                            <option value="0">Anders</option>
                        </select>
                    </div>
                </div>

                <!-- Notities (alleen) -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Notities</label
                    >
                    <textarea
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={selectedReservation.adminNotes}
                        rows="3"
                    ></textarea>
                </div>
            </div>
            {#if selectedReservation.status != "pending"}
                <div
                    transition:slide
                    class="animate-fade-in-up flex items-start gap-3"
                    style="--delay: 0.9s"
                >
                    <input
                    bind:checked={editedMailUpdate}
                        id="editedMailUpdate"
                        type="checkbox"
                        class="mt-1 w-5 h-5 rounded-md bg-zinc-800 border-zinc-700 focus:ring-blue-400/50 checked:bg-blue-400/80"
                        required
                    />
                    <label for="editedMailUpdate" class="text-black">
                        Ik wil de klant per mail updaten van deze statusupdate.
                    </label>
                </div>
            {/if}
            <!-- Actie Knoppen -->
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

<!-- Nieuwe add-modal voor klant + reservering -->
{#if showAddModal}
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
            <h2 class="text-xl font-semibold mb-4">
                Nieuwe Reservering Toevoegen
            </h2>
            <!-- Customer gegevens -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <!-- Voornaam en Achternaam naast elkaar -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Voornaam</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.firstName}
                        required
                    />
                </div>
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Achternaam</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.lastName}
                        required
                    />
                </div>

                <!-- Email en Telefoon naast elkaar -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Email</label
                    >
                    <input
                        type="email"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.email}
                        required
                    />
                </div>
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Telefoon</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.phone}
                        required
                    />
                </div>
            </div>

            <!-- Reservation gegevens -->
            <div class="grid grid-cols-1 gap-4">
                <!-- Photobooth ID en Type Evenement naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Photobooth ID</label
                        >
                        <input
                            type="text"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.photobooth_id}
                            required
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Type Evenement</label
                        >
                        <input
                            type="text"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.event_type}
                            required
                        />
                    </div>
                </div>

                <!-- Locatie alleen -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Locatie</label
                    >
                    <input
                        type="text"
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.event_location}
                        required
                    />
                </div>

                <!-- Boekingstijd en Boekingsdatum naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Boekingstijd</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.event_time}
                            required
                        >
                            <option value="">Selecteer een tijd</option>
                            <option value="13:00">12:00</option>
                            <option value="14:00">13:00</option>
                            <option value="15:00">14:00</option>
                            <option value="16:00">15:00</option>
                            <option value="17:00">16:00</option>
                            <option value="18:00">17:00</option>
                            <option value="19:00">18:00</option>
                            <option value="20:00">19:00</option>
                            <option value="21:00">20:00</option>
                            <option value="22:00">21:00</option>
                            <option value="23:00">22:00</option>
                            <option value="00:00">23:00</option>
                            <option value="01:00">00:00</option>
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Boekingsdatum</label
                        >
                        <input
                            type="date"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.event_date}
                            required
                        />
                    </div>
                </div>

                <!-- Totaalprijs, Aanbetaling en Resterend bedrag in 3 kolommen -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Totaalprijs (€)</label
                        >
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.totalPrice}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Aanbetaling (€)</label
                        >
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.depositAmount}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Resterend bedrag (€)</label
                        >
                        <input
                            type="number"
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.finalPaymentAmount}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <!-- Status, Betaalstatus en Event Duration naast elkaar -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Status</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.status}
                            required
                        >
                            <option value="accepted">Geaccepteerd</option>
                            <option value="cancelled">Geannuleerd</option>
                            <option value="completed">Voltooid</option>
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Betaalstatus</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.payment_status}
                            required
                        >
                            <option value="deposit_paid">Aanbetaald</option>
                            <option value="final_pending">Niet betaald</option>
                            <option value="final_paid">Betaling Compleet</option
                            >
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 font-medium"
                            >Aantal uur</label
                        >
                        <select
                            class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                            bind:value={newEntry.event_duration}
                            required
                        >
                            <option value="">Selecteer duur</option>
                            <option value="2">2 uur</option>
                            <option value="3">3 uur</option>
                            <option value="4">4 uur</option>
                            <option value="5">5 uur</option>
                            <option value="other">Anders</option>
                        </select>
                    </div>
                </div>

                <!-- Notities alleen -->
                <div>
                    <label for="" class="block text-gray-700 font-medium"
                        >Notities</label
                    >
                    <textarea
                        class="w-full border px-3 py-2 rounded focus:outline-blue-500"
                        bind:value={newEntry.adminNotes}
                        rows="3"
                    ></textarea>
                </div>
            </div>
            <div
            transition:slide
            class="animate-fade-in-up flex items-start gap-3"
            style="--delay: 0.9s"
        >
            <input
            bind:checked={createdMailUpdate}
                id="createdMailUpdate"
                type="checkbox"
                class="mt-1 w-5 h-5 rounded-md bg-zinc-800 border-zinc-700 focus:ring-blue-400/50 checked:bg-blue-400/80"
                required
            />
            <label for="editedMailUpdate" class="text-black">
                Ik wil de klant per mail updaten van deze statusupdate.
            </label>
        </div>
            <!-- Actie knoppen -->
            <div class="flex justify-end mt-4 space-x-2">
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    on:click={closeAddModal}
                >
                    Annuleren
                </button>
                <button
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    on:click={saveNewEntry}
                >
                    Opslaan
                </button>
            </div>
        </div>
    </div>
{/if}
