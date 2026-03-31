'use strict';

const _ = require('lodash');
const { concat, compact, isArray } = require('lodash/fp');
const utils = require('@strapi/utils');

const { ApplicationError, ValidationError } = utils.errors;

const VALID_USER_TYPES = ['company', 'investor', 'expert'];

const REQUIRED_FIELDS = {
  company: ['company_name'],
  investor: ['investor_name'],
  expert: ['expert_name', 'specialty'],
};

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');
  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const getService = (name) => {
  return strapi.plugin('users-permissions').service(name);
};

module.exports = (plugin) => {
  const originalRegister = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    const { user_type, display_name, company_name, investor_name, expert_name, specialty, ...rest } =
      ctx.request.body;

    // If no user_type provided, fall back to default Strapi register
    if (!user_type) {
      return originalRegister(ctx);
    }

    if (!VALID_USER_TYPES.includes(user_type)) {
      throw new ValidationError(
        `Invalid user_type. Must be one of: ${VALID_USER_TYPES.join(', ')}`
      );
    }

    // Validate required fields per user_type
    const required = REQUIRED_FIELDS[user_type];
    const missing = required.filter((field) => !ctx.request.body[field]);
    if (missing.length > 0) {
      throw new ValidationError(
        `Missing required fields for ${user_type}: ${missing.join(', ')}`
      );
    }

    // --- Run the standard Strapi registration logic ---
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const { register } = strapi.config.get('plugin::users-permissions');
    const alwaysAllowedKeys = ['username', 'password', 'email'];
    const customAllowedKeys = ['user_type', 'display_name'];
    const profileKeys = ['company_name', 'investor_name', 'expert_name', 'specialty'];

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        customAllowedKeys,
        isArray(register?.allowedFields) ? register.allowedFields : []
      )
    );

    // Build user params (exclude profile-specific keys from validation)
    const params = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: 'local',
    };

    const validations = strapi.config.get('plugin::users-permissions.validationRules');

    // Validate using Strapi's built-in validation (checks username, email, password)
    const { validateRegisterBody } = require('@strapi/plugin-users-permissions/server/controllers/validation/auth');
    await validateRegisterBody(params, validations);

    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi.db.query('plugin::users-permissions.user').count({
      where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
      throw new ApplicationError('Email or Username are already taken');
    }

    if (settings.unique_email) {
      const count = await strapi.db.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter },
      });
      if (count > 0) {
        throw new ApplicationError('Email or Username are already taken');
      }
    }

    // Create user with custom fields
    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      confirmed: !settings.email_confirmation,
      user_type,
      display_name: display_name || username,
      subscription_status: 'free',
    };

    const user = await getService('user').add(newUser);

    // Create the corresponding profile entry
    const profileData = { user: user.id };

    switch (user_type) {
      case 'company':
        profileData.name = company_name;
        profileData.country = ctx.request.body.country || 'Other';
        profileData.owner = user.id;
        delete profileData.user;
        await strapi.documents('api::company.company').create({ data: profileData });
        break;
      case 'investor':
        profileData.name = investor_name;
        await strapi.documents('api::investor.investor').create({ data: profileData });
        break;
      case 'expert':
        profileData.name = expert_name;
        profileData.specialty = specialty;
        await strapi.documents('api::expert.expert').create({ data: profileData });
        break;
    }

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await getService('user').sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        strapi.log.error(err);
        throw new ApplicationError('Error sending confirmation email');
      }
      return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService('jwt').issue(_.pick(user, ['id']));
    return ctx.send({ jwt, user: sanitizedUser });
  };

  return plugin;
};
