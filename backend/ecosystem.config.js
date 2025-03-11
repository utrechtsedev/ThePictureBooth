module.exports = {
    apps: [{
      name: 'Picture Express',
      script: './server.js', // Pad naar je Express entry file
      instances: 'max',      // Gebruik alle CPU cores
      exec_mode: 'cluster',  // Cluster-modus voor betere prestaties
      autorestart: true,
      watch: false,          // Zet op 'true' voor dev (niet aanbevolen in productie)
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      }
    }]
  };