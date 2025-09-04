export default async () => {
  // Get the public role
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });

  // Update permissions for the public role
  const permissions = await strapi
    .query("plugin::users-permissions.permission")
    .findMany({ where: { role: publicRole.id } });

  // Enable curso permissions
  await strapi.query("plugin::users-permissions.permission").updateMany({
    where: {
      role: publicRole.id,
      action: ["find", "findOne"],
      subject: "api::curso.curso",
    },
    data: {
      enabled: true,
    },
  });

  // Configure Google OAuth provider with proper redirect URLs
  try {
    const pluginStore = strapi.store({
      environment: process.env.NODE_ENV || "development",
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore.get({ key: "advanced" });

    // Type guard to ensure settings has the expected structure
    if (
      settings &&
      typeof settings === "object" &&
      "providers" in settings &&
      settings.providers &&
      typeof settings.providers === "object" &&
      "google" in settings.providers &&
      settings.providers.google
    ) {
      const googleConfig = settings.providers.google as any;

      // Update redirect URLs to include locales
      const baseUrl = process.env.PUBLIC_URL || "http://localhost:5173";
      const redirectUrls = [
        `${baseUrl}/pt/connect/google/redirect`,
        `${baseUrl}/en/connect/google/redirect`,
        `${baseUrl}/connect/google/redirect`, // fallback
      ];

      // Update the configuration with proper type casting
      const updatedSettings = {
        ...(settings as Record<string, any>),
        providers: {
          ...(settings.providers as Record<string, any>),
          google: {
            ...googleConfig,
            redirect: redirectUrls.join(","),
          },
        },
      };

      await pluginStore.set({
        key: "advanced",
        value: updatedSettings,
      });

      console.log("Google OAuth redirect URLs updated successfully");
    } else {
      console.log(
        "Google OAuth provider not configured yet, skipping configuration update",
      );
    }
  } catch (error) {
    console.warn("Could not update Google OAuth configuration:", error);
  }
};
