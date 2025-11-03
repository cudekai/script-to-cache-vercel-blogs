module.exports = {
  apps: [
    {
      name: "my-app", // 👈 your app name
      script: "server.js", // 👈 main entry file
      instances: 1, // or "max" for all CPU cores
      exec_mode: "fork", // or "cluster"
      watch: false, // set to true if you want file watching
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
