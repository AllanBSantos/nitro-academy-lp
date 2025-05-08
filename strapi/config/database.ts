import path from "path";

interface StrapiEnv {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
}

export default ({ env }: { env: StrapiEnv }) => {
  const client = env("DATABASE_CLIENT", "sqlite");

  const isPostgres = client === "postgres";

  return {
    connection: {
      client,
      connection: isPostgres
        ? {
            host: env("DATABASE_HOST"),
            port: env.int("DATABASE_PORT", 5432),
            database: env("DATABASE_NAME"),
            user: env("DATABASE_USERNAME"),
            password: env("DATABASE_PASSWORD"),
            ssl: env.bool("DATABASE_SSL", false)
              ? {
                  rejectUnauthorized: env.bool(
                    "DATABASE_SSL_REJECT_UNAUTHORIZED",
                    false,
                  ),
                }
              : false,
          }
        : {
            filename: path.join(
              __dirname,
              "..",
              "..",
              env("DATABASE_FILENAME", ".tmp/data.db"),
            ),
          },
      useNullAsDefault: !isPostgres,
    },
  };
};
