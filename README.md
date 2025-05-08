# ThePictureBooth

ThePictureBooth is een krachtige en gebruiksvriendelijke fullstack webapplicatie, speciaal ontwikkeld voor ThePictureBooth, een bedrijf die actief is in de verhuur van photobooths. Met zowel een klantgerichte storefront als een uitgebreide backend-dashboard, maakt deze app boekingsbeheer, klantadministratie en financiële rapportage eenvoudig en efficiënt.

## Functionaliteiten
### Boekingen
* Beheer eenvoudig boekingen (aanmaken, wijzigen, annuleren).
* Automatische notificaties en statusupdates via e-mail.

### Klantbeheer
* Uitgebreide klantgegevens beheren en opvolgen.
* Direct factureren vanuit de app.

### Financieel beheer
* Overzichtelijke omzet- en kostenrapportages.
* Gemakkelijk BTW-overzichten genereren en bijhouden.

### Applicatiebeheer
* Medewerkeraccounts eenvoudig beheren.
* Mobile-first, optimaal voor gebruik onderweg.

### Gebruikte Technologieën
* SvelteKit: flexibel en snel JavaScript framework.
* TailwindCSS + DaisyUI: snelle en consistente styling.
* MariaDB: betrouwbare en robuuste database.
* MinIO S3: object storage voor media en documenten.
* Sequelize: ORM voor eenvoudige database-integratie.
* PDFKit: dynamische PDF-generatie voor facturering.

## Installatie en Gebruik
### Vereisten
* Node.js
* MariaDB
* S3 opslag

### Installatie
```
git clone github.com/utrechtsedev/thepicturebooth
cd thepicturebooth
npm install
```

### Configuratie

Kopieer het .env.example bestand naar .env en vul je gegevens in:

cp .env.example .env

### Starten van de App
```
npm run dev
```

### Bijdragen

Dit project is open-source onder de GPLv3 licentie. Voel je vrij om verbeteringen en nieuwe features voor te stellen via pull requests.

### Licentie

Dit project is gelicenseerd onder de GPLv3 licentie.


Dank voor je interesse in ThePictureBooth! Veel succes!

