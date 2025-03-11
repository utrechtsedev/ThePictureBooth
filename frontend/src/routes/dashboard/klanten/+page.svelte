<script>
    import { TableHandler } from "@vincjo/datatables";
    import { slide, fade } from "svelte/transition";
    import Fuse from "fuse.js";

    let customers = [];
    let filteredCustomers = [];
    let table;
    let loading = true;
    let searchQuery = "";
    let sortColumn = "last_name";
    let sortDirection = "asc";
    let fuse;
    let showNewCustomerModal = false;
    let newCustomer = {
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
    };
    let isSaving = false;
    let errorMessage = "";
    let showModal = false;
    let selectedCustomer = null;

    async function fetchCustomers() {
        loading = true;
        try {
            const res = await fetch("https://thepicturebooth.nl/api/customers");
            if (!res.ok) throw new Error("Failed to fetch customers");
            customers = await res.json();

            filteredCustomers = [...customers];

            fuse = new Fuse(customers, {
                keys: ["first_name", "last_name", "email", "phone"],
                threshold: 0.3,
            });

            applySorting();
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            loading = false;
        }
    }

    fetchCustomers();

    function filterResults() {
        let results = [...customers];

        if (searchQuery.trim() !== "" && fuse) {
            const searchResults = fuse.search(searchQuery);
            results = searchResults.map(result => result.item);
        }

        filteredCustomers = results;
        applySorting();
    }

    function applySorting() {
        filteredCustomers.sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
            if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        table = new TableHandler(filteredCustomers, { rowsPerPage: 10 });
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

    function openEditModal(customer) {
        selectedCustomer = { ...customer };
        showModal = true;
    }

    function closeEditModal() {
        showModal = false;
        selectedCustomer = null;
    }

    async function saveChanges() {
        if (!selectedCustomer || isSaving) return;
        isSaving = true;

        try {
            const res = await fetch(`https://thepicturebooth.nl/api/customers/${selectedCustomer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: selectedCustomer.first_name,
                    last_name: selectedCustomer.last_name,
                    email: selectedCustomer.email,
                    phone: selectedCustomer.phone,
                }),
            });

            if (!res.ok) throw new Error("Fout bij opslaan");

            await fetchCustomers();
            closeEditModal();
        } catch (error) {
            console.error("Error updating customer:", error);
            alert("Er is een fout opgetreden bij het opslaan van de klantgegevens.");
        } finally {
            isSaving = false;
        }
    }
    function openNewCustomerModal() {
        showNewCustomerModal = true;
    }

    function closeNewCustomerModal() {
        showNewCustomerModal = false;
        newCustomer = { first_name: "", last_name: "", email: "", phone: "" };
        errorMessage = "";
    }

    async function saveNewCustomer() {
        if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.email || !newCustomer.phone) {
            errorMessage = "Alle velden zijn verplicht!";
            return;
        }

        isSaving = true;
        try {
            const response = await fetch("https://thepicturebooth.nl/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
            });

            if (!response.ok) throw new Error("Fout bij het toevoegen van de klant");

            const createdCustomer = await response.json();

            // **Hier kun je de klantenlijst updaten zonder de pagina te refreshen**
            // customers = [...customers, createdCustomer];
            closeNewCustomerModal();
        } catch (error) {
            errorMessage = "Kan klant niet toevoegen. Probeer het opnieuw.";
            console.error(error);
        } finally {
            await fetchCustomers();
            isSaving = false;
        }
    }
</script>

<!-- 🔍 Zoekbalk -->
<div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
    <input 
        type="text" 
        class="border px-3 py-2 rounded w-full md:w-1/3" 
        bind:value={searchQuery} 
        placeholder="🔍 Zoek op naam, e-mail, telefoon..." 
        on:input={filterResults} 
    />
</div>

<div class="bg-white rounded-lg shadow">
    <div class="flex justify-between items-center mb-4 p-4">
        <h2 class="text-2xl font-bold text-gray-700">
            Klantenbestand
        </h2>
        <button on:click={openNewCustomerModal}
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
            +
        </button>
    </div>

<!-- 📋 Klanten Tabel -->
<div class="bg-white rounded-lg shadow overflow-hidden">
    {#if loading}
        <!-- Skeleton Loader -->
        {#each Array(5) as _}
            <div class="p-4 animate-pulse bg-gray-100 rounded my-2 h-10 w-full"></div>
        {/each}
    {:else}
        <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] border-collapse text-center">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition" on:click={() => changeSort("first_name")}>
                            Voornaam {sortColumn === "first_name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition" on:click={() => changeSort("last_name")}>
                            Achternaam {sortColumn === "last_name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition" on:click={() => changeSort("email")}>
                            E-mail {sortColumn === "email" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th class="py-3 px-4 cursor-pointer hover:bg-gray-200 transition" on:click={() => changeSort("phone")}>
                            Telefoon {sortColumn === "phone" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th class="py-3 px-4">Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {#each table.rows as row}
                        <tr class="border-b hover:bg-gray-50 transition">
                            <td class="py-3 px-4">{row.first_name}</td>
                            <td class="py-3 px-4">{row.last_name}</td>
                            <td class="py-3 px-4">{row.email}</td>
                            <td class="py-3 px-4">{row.phone}</td>
                            <td class="py-3 px-4">
                                <div class="flex justify-center space-x-2">
                                    <button 
                                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        on:click={() => openEditModal(row)}
                                    >
                                        Bewerk
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
</div>

<!-- 📝 Bewerk Klant Modal -->
{#if showModal}
    <div transition:fade={{ duration: 300 }} class="fixed inset-0 bg-black opacity-50 backdrop-blur-md"></div>
    <div transition:fade class="fixed inset-0 flex justify-center p-4 overflow-y-auto">
        <div transition:slide={{ duration: 300 }} class="border border-gray-300 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl max-h-[350px] overflow-y-auto mt-10 md:mt-20 mb-10">
            <h2 class="text-xl font-semibold mb-4">Bewerk Klant</h2>

            <input type="text" class="w-full border px-3 py-2 rounded" bind:value={selectedCustomer.first_name} />
            <input type="text" class="w-full border px-3 py-2 rounded mt-2" bind:value={selectedCustomer.last_name} />
            <input type="email" class="w-full border px-3 py-2 rounded mt-2" bind:value={selectedCustomer.email} />
            <input type="text" class="w-full border px-3 py-2 rounded mt-2" bind:value={selectedCustomer.phone} />

            <div class="flex justify-end mt-4 space-x-2">
                <button class="bg-gray-500 text-white px-4 py-2 rounded" on:click={closeEditModal}>Annuleren</button>
                <button class="bg-green-500 text-white px-4 py-2 rounded" on:click={saveChanges}>Opslaan</button>
            </div>
        </div>
    </div>
{/if}

{#if showNewCustomerModal}
    <!-- 🔳 Overlay -->
    <div transition:fade class="fixed inset-0 bg-black opacity-50 backdrop-blur-md"></div>
    
    <!-- 📝 Modal -->
    <div transition:slide class="fixed inset-0 flex justify-center items-center p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Nieuwe Klant Toevoegen</h2>
            
            {#if errorMessage}
                <p class="text-red-500 text-sm mb-2">{errorMessage}</p>
            {/if}
            
            <div class="grid gap-4">
                <input type="text" class="border px-3 py-2 rounded w-full" bind:value={newCustomer.first_name} placeholder="Voornaam" required />
                <input type="text" class="border px-3 py-2 rounded w-full" bind:value={newCustomer.last_name} placeholder="Achternaam" required />
                <input type="email" class="border px-3 py-2 rounded w-full" bind:value={newCustomer.email} placeholder="E-mail" required />
                <input type="text" class="border px-3 py-2 rounded w-full" bind:value={newCustomer.phone} placeholder="Telefoonnummer" required />
            </div>
            
            <div class="flex justify-end mt-4 space-x-2">
                <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" on:click={closeNewCustomerModal}>
                    Annuleren
                </button>
                <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50" on:click={saveNewCustomer} disabled={isSaving}>
                    {isSaving ? "Opslaan..." : "Opslaan"}
                </button>
            </div>
        </div>
    </div>
{/if}