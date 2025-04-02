<script>
  import { createEventDispatcher, tick } from "svelte";
  import { slide } from "svelte/transition";
  import { fade } from "svelte/transition";

  export let recipients = [];

  // State
  let emailForm = {
    subject: "",
    body: "",
    sendCopy: false,
    template: "",
    isHtml: false, // Nieuwe optie voor HTML emails
  };

  let loading = false;
  let errorMessage = "";
  let successMessage = "";
  let showPreview = false;
  let previewIframe; // Reference naar de iframe voor HTML preview
  let previewContainer; // Reference naar de container div

  // Email templates
  let emailTemplates = [
    {
      id: "welcome",
      name: "Welkomstmail",
      subject: "Welkom bij The Picture Booth!",
    },
    {
      id: "follow_up",
      name: "Opvolging na evenement",
      subject: "Bedankt voor je boeking bij The Picture Booth",
    },
    {
      id: "discount",
      name: "Kortingsaanbieding",
      subject: "Speciale aanbieding voor jou",
    },
    {
      id: "newsletter",
      name: "Nieuwsbrief",
      subject: "Nieuws en updates van The Picture Booth",
    },
  ];

  const dispatch = createEventDispatcher();

  function close(e) {
    e.stopPropagation();
    dispatch("close");
  }

  function loadEmailTemplate(templateId) {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      emailForm.subject = template.subject;

      // Placeholder for email content based on template
      if (recipients.length === 1) {
        const customer = recipients[0];

        // Basis template inhoud
        const welcomeContent = `Hartelijk welkom bij The Picture Booth! 
  
Wij zijn verheugd dat je hebt gekozen voor onze fotobooth diensten voor je aankomende evenement. We kijken ernaar uit om je speciale dag nog onvergetelijker te maken met leuke foto's en herinneringen.
  
Mocht je nog vragen hebben of extra informatie nodig hebben, aarzel dan niet om contact met ons op te nemen.`;

        const followUpContent = `Bedankt voor het boeken van The Picture Booth voor je recente evenement! 
  
We hopen dat jij en je gasten hebben genoten van de fotobooth en de mooie herinneringen die jullie hebben vastgelegd. We waarderen je vertrouwen in ons en hopen je in de toekomst weer van dienst te mogen zijn.
  
Als je een moment hebt, zouden we het op prijs stellen als je je ervaring met ons wilt delen door een korte recensie achter te laten.`;

        const discountContent = `Als waardering voor je vertrouwen in The Picture Booth, willen we je graag een speciale aanbieding doen!
  
Bij je volgende boeking ontvang je 10% korting op het totaalbedrag. Deze aanbieding is geldig voor evenementen die binnen 6 maanden plaatsvinden.
  
Gebruik kortingscode: LOYALTY10 bij het maken van je reservering.`;

        const newsletterContent = `We willen je graag op de hoogte houden van de nieuwste ontwikkelingen bij The Picture Booth!
  
- Nieuwe achtergrondopties toegevoegd
- Speciale thema-pakketten voor feestdagen
- Uitgebreide prop-collectie
  
Bekijk onze website voor meer informatie en neem gerust contact op bij vragen.`;

        // Kies de juiste content op basis van template ID
        const templateContent =
          template.id === "welcome"
            ? welcomeContent
            : template.id === "follow_up"
              ? followUpContent
              : template.id === "discount"
                ? discountContent
                : newsletterContent;

        // Voeg samenstelling en afsluiting toe
        emailForm.body = `Beste ${customer.first_name},
  
${templateContent}
  
Met vriendelijke groet,
  
The Picture Booth Team
info@thepicturebooth.nl
06-12345678`;

        // Als HTML is geselecteerd, converteer naar HTML formaat
        if (emailForm.isHtml) {
          convertToHtml();
        }
      } else {
        // Bulk email content met placeholders
        const welcomeContent = `Hartelijk welkom bij The Picture Booth! 
  
Wij zijn verheugd dat je hebt gekozen voor onze fotobooth diensten. We kijken ernaar uit om je speciale dag nog onvergetelijker te maken met leuke foto's en herinneringen.
  
Mocht je nog vragen hebben of extra informatie nodig hebben, aarzel dan niet om contact met ons op te nemen.`;

        const followUpContent = `Bedankt voor het boeken van The Picture Booth! 
  
We hopen dat jij en je gasten hebben genoten van de fotobooth en de mooie herinneringen die jullie hebben vastgelegd. We waarderen je vertrouwen in ons en hopen je in de toekomst weer van dienst te mogen zijn.
  
Als je een moment hebt, zouden we het op prijs stellen als je je ervaring met ons wilt delen door een korte recensie achter te laten.`;

        const discountContent = `Als waardering voor je vertrouwen in The Picture Booth, willen we je graag een speciale aanbieding doen!
  
Bij je volgende boeking ontvang je 10% korting op het totaalbedrag. Deze aanbieding is geldig voor evenementen die binnen 6 maanden plaatsvinden.
  
Gebruik kortingscode: LOYALTY10 bij het maken van je reservering.`;

        const newsletterContent = `We willen je graag op de hoogte houden van de nieuwste ontwikkelingen bij The Picture Booth!
  
- Nieuwe achtergrondopties toegevoegd
- Speciale thema-pakketten voor feestdagen
- Uitgebreide prop-collectie
  
Bekijk onze website voor meer informatie en neem gerust contact op bij vragen.`;

        // Kies de juiste content op basis van template ID
        const templateContent =
          template.id === "welcome"
            ? welcomeContent
            : template.id === "follow_up"
              ? followUpContent
              : template.id === "discount"
                ? discountContent
                : newsletterContent;

        // Bulk email met placeholders en afmeldingsinfo
        emailForm.body = `Beste {{first_name}},
  
${templateContent}
  
Met vriendelijke groet,
  
The Picture Booth Team
info@thepicturebooth.nl
06-12345678

---
*Je ontvangt deze e-mail omdat je klant bent bij The Picture Booth. 
Wil je geen e-mails meer ontvangen? Klik dan op de link onderaan deze mail om je uit te schrijven.*`;

        // Als HTML is geselecteerd, converteer naar HTML formaat
        if (emailForm.isHtml) {
          convertToHtml();
        }
      }
    }
  }

  function convertToHtml() {
    if (!emailForm.isHtml || !emailForm.body) return;

    // Eenvoudige conversie van platte tekst naar HTML
    // In een echte applicatie zou je een betere parser/converter kunnen gebruiken
    let html = emailForm.body
      // Vervang newlines door <br> tags
      .replace(/\n/g, "<br>")
      // Vervang lijsten met bullets
      .replace(/- (.*?)(<br>|$)/g, "• $1$2")
      // Voeg wat basis HTML structuur toe
      .trim();

    // Voeg HTML wrapper toe
    html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .content {
      background-color: #fff;
      padding: 15px;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #777;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="content">
    ${html}
  </div>
</body>
</html>`;

    emailForm.body = html;
  }

  function convertToPlainText() {
    if (emailForm.isHtml && emailForm.body) {
      // Eenvoudige conversie van HTML naar platte tekst
      let text = emailForm.body
        // Verwijder HTML tags
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<\/h[1-6]>/gi, "\n\n")
        .replace(/<li>/gi, "- ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<.*?>/g, "")
        // Verwijder extra whitespace
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      emailForm.body = text;
    }
  }

  // Toggle tussen HTML en platte tekst mode
  function toggleHtmlMode() {
    if (emailForm.isHtml) {
      // Schakel over naar HTML mode
      convertToHtml();
    } else {
      // Schakel over naar platte tekst mode
      convertToPlainText();
    }
  }

  async function submitForm() {
    // Validate form
    if (!emailForm.subject || !emailForm.body) {
      errorMessage = "Vul alle verplichte velden in";
      return;
    }

    if (recipients.length === 0) {
      errorMessage = "Selecteer minstens één ontvanger";
      return;
    }

    // Reset messages
    errorMessage = "";
    successMessage = "";

    // Set loading state
    loading = true;

    try {
      // Stuur e-mail via de API
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject: emailForm.subject,
          body: emailForm.body,
          isHtml: emailForm.isHtml,
          sendCopy: emailForm.sendCopy,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        errorMessage =
          result.message ||
          "Er is een fout opgetreden bij het versturen van de e-mail";
        return;
      }

      // Toon succes bericht
      successMessage = result.message || "E-mail succesvol verzonden";

      // Sluit het venster na 2 seconden
      setTimeout(() => {
        dispatch("submit", {
          success: true,
          ...result,
        });
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      errorMessage =
        "Er is een onverwachte fout opgetreden bij het versturen van de e-mail";
    } finally {
      loading = false;
    }
  }

  // Functie voor het tonen van een veilige preview met iframe voor HTML
  async function togglePreview() {
    showPreview = !showPreview;

    // Als we naar preview gaan en het is HTML, wacht tot de DOM update klaar is
    // en update dan de iframe content
    if (showPreview && emailForm.isHtml) {
      await tick(); // Wacht op DOM update
      updateIframeContent();
    }
  }

  // Update iframe content met de huidige HTML body
  function updateIframeContent() {
    if (previewIframe && emailForm.isHtml) {
      // Schrijf de HTML inhoud naar de iframe
      const iframeDocument =
        previewIframe.contentDocument || previewIframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(emailForm.body);
      iframeDocument.close();

      // Geef de iframe een vaste hoogte
      previewIframe.style.height = "100%";
    }
  }
</script>

<div
  transition:slide={{ duration: 300, axis: "y" }}
  class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6"
  on:click|stopPropagation
>
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      {recipients.length > 1
        ? `E-mail versturen naar ${recipients.length} klanten`
        : `E-mail naar ${recipients[0]?.first_name} ${recipients[0]?.last_name}`}
    </h2>
    <button
      on:click={close}
      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>

  <!-- Error Message -->
  {#if errorMessage}
    <div
      transition:fade
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p class="font-bold">Er is een fout opgetreden</p>
      <p>{errorMessage}</p>
    </div>
  {/if}

  <!-- Success Message -->
  {#if successMessage}
    <div
      transition:fade
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p class="font-bold">Succes!</p>
      <p>{successMessage}</p>
    </div>
  {/if}

  <!-- Email Form -->
  <form class="space-y-6" on:submit|preventDefault={submitForm}>
    <div class="space-y-4">
      <div>
        <label
          for="email-to"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Aan</label
        >
        <div
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {#if recipients.length === 1}
            {recipients[0].email}
          {:else}
            {recipients.length} geselecteerde klanten
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {recipients
                .slice(0, 3)
                .map((r) => r.email)
                .join(", ")}
              {recipients.length > 3 ? ` + ${recipients.length - 3} meer` : ""}
            </div>
          {/if}
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-1">
          <label
            for="email-template"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Template</label
          >
          <button
            type="button"
            class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            on:click={() => {
              emailForm.template = "";
              emailForm.subject = "";
              emailForm.body = "";
            }}
          >
            Wissen
          </button>
        </div>
        <select
          id="email-template"
          bind:value={emailForm.template}
          on:change={() => loadEmailTemplate(emailForm.template)}
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-2"
        >
          <option value="">Selecteer een template</option>
          {#each emailTemplates as template}
            <option value={template.id}
              >{template.name} - {template.subject}</option
            >
          {/each}
        </select>
      </div>

      <div>
        <label
          for="email-subject"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Onderwerp *</label
        >
        <input
          type="text"
          id="email-subject"
          bind:value={emailForm.subject}
          placeholder="Onderwerp van de e-mail"
          required
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- HTML/Text toggle -->
      <div class="flex items-center justify-end">
        <label
          class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            type="checkbox"
            bind:checked={emailForm.isHtml}
            on:change={toggleHtmlMode}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
          />
          <span>HTML e-mail</span>
        </label>

        <!-- Preview toggle button -->
        {#if emailForm.body}
          <button
            type="button"
            on:click={togglePreview}
            class="ml-4 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
          >
            {showPreview ? "Bewerken" : "Preview"}
          </button>
        {/if}
      </div>

      <div>
        <label
          for="email-body"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >Bericht *</label
        >

        <!-- Preview Container -->
        <div
          bind:this={previewContainer}
          class="relative"
          style="display: {showPreview ? 'block' : 'none'}; height: 300px;"
        >
          {#if emailForm.isHtml}
            <!-- Gebruik een iframe voor HTML preview om styling isolatie te garanderen -->
            <iframe
              bind:this={previewIframe}
              title="Email Preview"
              class="w-full h-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white"
              style="overflow: auto; width: 100%;"
              sandbox="allow-same-origin"
            ></iframe>
          {:else}
            <!-- Platte tekst preview - deze gebruikt een pre tag voor betere whitespace weergave -->
            <div
              class="w-full h-full overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900"
            >
              <pre
                class="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm font-sans">{emailForm.body}</pre>
            </div>
          {/if}
        </div>

        <!-- Editor Textarea - tegenovergestelde weergave van de preview -->
        <textarea
          id="email-body"
          rows="10"
          bind:value={emailForm.body}
          placeholder={emailForm.isHtml
            ? "<p>Type hier je HTML bericht...</p>"
            : "Typ hier je bericht..."}
          required
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
          style="display: {showPreview ? 'none' : 'block'};"
        ></textarea>

        {#if recipients.length > 1}
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Je kunt <code>{{ first_name }}</code>, <code>{{ last_name }}</code>,
            en <code>{{ email }}</code>
            gebruiken om gepersonaliseerde e-mails te versturen.
          </p>
        {/if}
      </div>

      <div class="flex items-center">
        <input
          type="checkbox"
          id="send-copy"
          bind:checked={emailForm.sendCopy}
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
        />
        <label
          for="send-copy"
          class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Stuur een kopie naar mijzelf
        </label>
      </div>
    </div>

    <div
      class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
      <button
        type="button"
        on:click={close}
        class="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        disabled={loading}
      >
        Annuleren
      </button>
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[120px] justify-center"
        disabled={loading}
      >
        {#if loading}
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Versturen...
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"
            />
          </svg>
          Versturen
        {/if}
      </button>
    </div>
  </form>
</div>

