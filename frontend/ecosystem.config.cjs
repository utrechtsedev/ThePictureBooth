module.exports = {
    apps: [{
      name: 'The Picture Booth',
      script: 'build/index.js', // Pad naar de gebouwde server
      instances: 'max', // Gebruik alle CPU cores (of specificeer een getal)
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000 // Pas de poort aan indien nodig
      }
    }]
  };