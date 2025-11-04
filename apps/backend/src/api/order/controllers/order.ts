/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async find(ctx) {
      // Only show orders for the authenticated user
      if (!ctx.state.user) {
        return ctx.unauthorized("You must be logged in");
      }

    //   console.log("=== ORDER FIND DEBUG ===");
    //   console.log("User ID:", ctx.state.user.id);
    //   console.log(
    //     "Query populate:",
    //     JSON.stringify(ctx.query.populate, null, 2)
    //   );

      const entities = await strapi.entityService.findMany("api::order.order", {
        filters: {
          users_permissions_user: {
            id: ctx.state.user.id,
          },
        },
        populate: {
          orderItems: {
            populate: {
              pokemon: {
                populate: ["image"],
              },
            },
          },
        },
        sort: ctx.query.sort,
        pagination: ctx.query.pagination,
      });

    //   console.log(
    //     "Entities found:",
    //     Array.isArray(entities) ? entities.length : "not array"
    //   );
    //   console.log(
    //     "First entity:",
    //     entities?.[0] ? JSON.stringify(entities[0], null, 2) : "none"
    //   );

      const sanitizedEntities = entities;

    //   console.log("Sanitized results:", sanitizedEntities);

      return this.transformResponse(sanitizedEntities);
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      if (!ctx.state.user) {
        return ctx.unauthorized("You must be logged in");
      }

      // Fetch the order with populated data
      const entity = await strapi.entityService.findOne(
        "api::order.order",
        id,
        {
          populate: {
            orderItems: {
              populate: {
                pokemon: {
                  populate: ["image"],
                },
              },
            },
            users_permissions_user: true,
          },
        }
      );

      if (!entity) {
        return ctx.notFound("Order not found");
      }

      // Check if order belongs to current user
      if ((entity as any).users_permissions_user?.id !== ctx.state.user.id) {
        return ctx.forbidden("You can only view your own orders");
      }

      return this.transformResponse(entity);
    },
  })
);
