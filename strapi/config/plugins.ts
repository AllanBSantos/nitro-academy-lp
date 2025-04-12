export default () => ({
  "users-permissions": {
    config: {
      jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    },
  },
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        sizeLimit: 1000000,
        path: "/opt/render/project/src/public/uploads",
      },
    },
  },
});
