const bookings = [
    {
      id: 1,
      customer: {
        name: 'Laura van den Berg',
        email: 'laura@example.com',
        phone: '06-12345678'
      },
      eventType: 'Bruiloft',
      date: '2025-04-15',
      startTime: '16:00',
      endTime: '22:00',
      location: 'Landgoed Wolfslaar, Breda',
      package: 'Premium',
      price: 595,
      status: 'confirmed',
      notes: 'Speciale achtergrond gewenst voor de fotobooth.',
      paymentStatus: 'deposit_paid',
      created: '2025-02-10'
    },
    {
      id: 2,
      customer: {
        name: 'Bedrijf XYZ',
        email: 'events@xyz.com',
        phone: '06-87654321'
      },
      eventType: 'Bedrijfsfeest',
      date: '2025-04-05',
      startTime: '19:00',
      endTime: '23:00',
      location: 'Kantoor XYZ, Amsterdam',
      package: 'Basic',
      price: 395,
      status: 'confirmed',
      notes: 'Logo op de prints plaatsen',
      paymentStatus: 'paid',
      created: '2025-02-05'
    },
    {
      id: 3,
      customer: {
        name: 'Mark Jansen',
        email: 'mark@example.com',
        phone: '06-11223344'
      },
      eventType: 'Verjaardag',
      date: '2025-03-22',
      startTime: '20:00',
      endTime: '01:00',
      location: 'Café De Kroon, Utrecht',
      package: 'Standard',
      price: 450,
      status: 'pending',
      notes: '',
      paymentStatus: 'unpaid',
      created: '2025-02-15'
    },
    {
      id: 4,
      customer: {
        name: 'Emma de Vries',
        email: 'emma@example.com',
        phone: '06-99887766'
      },
      eventType: 'Bruiloft',
      date: '2025-05-10',
      startTime: '15:00',
      endTime: '23:00',
      location: 'Kasteel Maurick, Vught',
      package: 'Premium',
      price: 650,
      status: 'confirmed',
      notes: 'Gastenboek service toegevoegd',
      paymentStatus: 'deposit_paid',
      created: '2025-01-20'
    },
    {
      id: 5,
      customer: {
        name: 'Sophie Bakker',
        email: 'sophie@example.com',
        phone: '06-55443322'
      },
      eventType: 'Afstuderen',
      date: '2025-06-28',
      startTime: '17:00',
      endTime: '21:00',
      location: 'Thuis, Rotterdam',
      package: 'Basic',
      price: 375,
      status: 'confirmed',
      notes: '',
      paymentStatus: 'paid',
      created: '2025-02-28'
    },
    {
      id: 6,
      customer: {
        name: 'Thomas Boer',
        email: 'thomas@example.com',
        phone: '06-22334455'
      },
      eventType: 'Afstuderen',
      date: '2025-06-30',
      startTime: '17:00',
      endTime: '21:00',
      location: 'Universiteit, Amsterdam',
      package: 'Basic',
      price: 375,
      status: 'confirmed',
      notes: '',
      paymentStatus: 'paid',
      created: '2025-03-01'
    },
    {
      id: 7,
      customer: {
        name: 'Peter Janssen',
        email: 'peter@example.com',
        phone: '06-55667788'
      },
      eventType: 'Bedrijfsfeest',
      date: '2025-07-15',
      startTime: '18:00',
      endTime: '23:00',
      location: 'Hotel Central, Den Haag',
      package: 'Standard',
      price: 495,
      status: 'confirmed',
      notes: 'Extra accessoires gewenst',
      paymentStatus: 'deposit_paid',
      created: '2025-03-05'
    },
    {
      id: 8,
      customer: {
        name: 'Lisa Smit',
        email: 'lisa@example.com',
        phone: '06-11223355'
      },
      eventType: 'Verjaardag',
      date: '2025-05-22',
      startTime: '19:00',
      endTime: '23:00',
      location: 'Restaurant De Kade, Rotterdam',
      package: 'Basic',
      price: 375,
      status: 'confirmed',
      notes: '',
      paymentStatus: 'paid',
      created: '2025-02-20'
    },
    {
      id: 9,
      customer: {
        name: 'Bedrijf ABC',
        email: 'events@abc.com',
        phone: '06-99887755'
      },
      eventType: 'Productlancering',
      date: '2025-04-28',
      startTime: '14:00',
      endTime: '18:00',
      location: 'Conferentiecentrum, Eindhoven',
      package: 'Premium',
      price: 595,
      status: 'confirmed',
      notes: 'Branded achtergrond vereist',
      paymentStatus: 'paid',
      created: '2025-02-15'
    },
    {
      id: 10,
      customer: {
        name: 'Jan de Wit',
        email: 'jan@example.com',
        phone: '06-33445566'
      },
      eventType: 'Jubileum',
      date: '2025-08-10',
      startTime: '16:00',
      endTime: '22:00',
      location: 'Feestzaal Het Plein, Utrecht',
      package: 'Deluxe',
      price: 695,
      status: 'pending',
      notes: 'Speciale accessoires voor gouden jubileum',
      paymentStatus: 'unpaid',
      created: '2025-03-10'
    },
    {
      id: 11,
      customer: {
        name: 'Anna Visser',
        email: 'anna@example.com',
        phone: '06-12345687'
      },
      eventType: 'Bruiloft',
      date: '2025-09-05',
      startTime: '15:00',
      endTime: '23:00',
      location: 'Kasteel Keukenhof, Lisse',
      package: 'Premium',
      price: 650,
      status: 'confirmed',
      notes: 'Buitenlocatie, elektriciteit beschikbaar',
      paymentStatus: 'deposit_paid',
      created: '2025-03-02'
    },
    {
      id: 12,
      customer: {
        name: 'Erik Meijer',
        email: 'erik@example.com',
        phone: '06-98765432'
      },
      eventType: 'Pensioen',
      date: '2025-06-12',
      startTime: '16:00',
      endTime: '20:00',
      location: 'Kantoor, Amstelveen',
      package: 'Standard',
      price: 450,
      status: 'confirmed',
      notes: '',
      paymentStatus: 'paid',
      created: '2025-03-15'
    }
  ];
