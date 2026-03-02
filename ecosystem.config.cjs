module.exports = {
  apps: [{
    name: 'eventx',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    env: {
      NODE_ENV: 'production',
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'eventx-secret-key-dev-environment',
    },
    watch: false,
    instances: 1,
    exec_mode: 'fork',
  }]
}
