export default ({ env }: any) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: ["myKeyA", "myKeyB"],
  },
});
