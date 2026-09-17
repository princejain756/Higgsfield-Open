module.exports = {
  apps: [
    {
      name: 'higgsfield-prince-sh',
      cwd: '/root/websites/higgsfield',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3250',
      env: {
        NODE_ENV: 'production',
        PORT: 3250,
        HF_API_BASE_URL: 'https://api.higgsfield.ai',
        NEXT_PUBLIC_SITE_URL: 'https://higgsfield.prince.sh'
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: false
    }
  ]
};
