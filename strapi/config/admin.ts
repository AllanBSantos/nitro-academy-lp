export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "your-secret-key"),
  },
  apiToken: {
    salt: "I3I53WqB8+J/Hui7wqNgtA==",
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "your-transfer-token-salt"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
