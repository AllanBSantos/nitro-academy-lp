import path from "path";

export default ({ env }) => {
  const isProduction = env("NODE_ENV") === "production";

  return {
    "users-permissions": {
      config: {
        jwtSecret: env("JWT_SECRET", "your-secret-key"),
      },
    },
    upload: {
      config: isProduction
        ? {
            provider: "cloudinary",
            providerOptions: {
              cloud_name: env("CLOUDINARY_NAME"),
              api_key: env("CLOUDINARY_KEY"),
              api_secret: env("CLOUDINARY_SECRET"),
            },
          }
        : {
            provider: "local",
            providerOptions: {
              sizeLimit: 1000000,
              uploadPath: path.resolve(__dirname, "..", "..", "public/uploads"),
            },
          },
    },
  };
};
