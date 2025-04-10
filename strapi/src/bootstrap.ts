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
};
