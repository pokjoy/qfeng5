module.exports = {
  apps: [
    {
      name: 'pokjoy-mp',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/pokjoy-mp',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}


