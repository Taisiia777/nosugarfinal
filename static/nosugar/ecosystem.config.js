module.exports = {
    apps: [
      {
        name: 'react-app',
        script: 'npm',
        args: 'start',
        env: {
          NODE_ENV: 'production',
          PORT: 3000
        }
      }
    ]
  };
  