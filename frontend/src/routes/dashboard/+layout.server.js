// src/routes/+layout.server.js
export async function load({ fetch }) {

    const fetchCustomers = await fetch('/api/some-endpoint');
    const fetchPayments = '';
    const fetchReservations = '';
    const fetchActivityLogs = '';
    const fetchPhotobooths = '';
    
    
    
    
    const a = await response.json();
    
    return {
      someData: data,
      externalData: externalData,
    };
  }