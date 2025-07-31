/**
 * aluno-escola-parceira controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::aluno-escola-parceira.aluno-escola-parceira",
  ({ strapi }) => ({
    async find(ctx) {
      // Disable caching
      ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
      ctx.set("Pragma", "no-cache");
      ctx.set("Expires", "0");

      // Call the default find method
      const { data, meta } = await super.find(ctx);

      return { data, meta };
    },

    async findOne(ctx) {
      // Disable caching
      ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
      ctx.set("Pragma", "no-cache");
      ctx.set("Expires", "0");

      // Call the default findOne method
      const response = await super.findOne(ctx);

      return response;
    },

    async create(ctx) {
      // Disable caching
      ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
      ctx.set("Pragma", "no-cache");
      ctx.set("Expires", "0");

      // Call the default create method
      const response = await super.create(ctx);

      return response;
    },
  }),
);
