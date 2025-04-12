import path from "path";

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
        uploadPath: path.resolve("/opt/render/project/src/public/uploads"),
      },
    },
  },
});
