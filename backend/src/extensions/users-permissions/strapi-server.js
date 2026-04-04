'use strict';

const VALID_USER_TYPES = ['company', 'investor', 'expert'];

module.exports = (plugin) => {
  // Keep the original register as fallback for non-typed registrations
  const originalRegister = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    const { user_type } = ctx.request.body;

    // If user_type is provided, redirect to custom endpoint
    if (user_type) {
      return ctx.badRequest(
        'Use /api/custom-auth/register for typed registration'
      );
    }

    // Default Strapi register for non-typed users
    return originalRegister(ctx);
  };

  return plugin;
};
