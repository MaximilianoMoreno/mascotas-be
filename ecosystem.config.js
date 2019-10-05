module.exports = {
  apps: [{
    name: 'gmg',
    script: './server.js'
  }],
  deploy: {
    production: {
      user: 'GMG',
      host: 'ec2-34-207-168-123.compute-1.amazonaws.com',
      key: '~/.ssh/AWS-prod.pem',
      ref: 'origin/master',
      repo: 'git@github.com:MaximilianoMoreno/gmg.git',
      path: '/home/ubuntu/gmg',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}