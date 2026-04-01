'use strict';

const _ = require('lodash');
const { concat, compact, isArray } = require('lodash/fp');
const utils = require('@strapi/utils');

const { ApplicationError, ValidationError } = utils.errors;

const VALID_USER_TYPES = ['company', 'investor', 'expert'];

const REQUIRED_FIELDS = {
  company: ['name_of_the_company', 'name_of_the_person', 'email'],
  investor: ['name_of_the_company', 'name_of_the_person', 'email'],
  expert: ['name_of_the_person', 'email'],
};

// Fields that belong to each profile content type (not the user)
const COMPANY_PROFILE_FIELDS = [
  'name_of_the_company', 'name_of_the_person', 'email', 'telephone_mobile',
  'industry', 'employee_count', 'website', 'area_of_specification',
  'short_description', 'description', 'requirements_for_partnership',
  'existing_partners', 'continent', 'country', 'foundation_country',
  'membership_duration',
];

const INVESTOR_PROFILE_FIELDS = [
  'name_of_the_company', 'name_of_the_person', 'email', 'telephone_mobile',
  'foundation_year', 'type_of_investor', 'investment_policies',
  'eligibility_criteria', 'short_description', 'continent', 'country',
  'location_of_headquarters', 'location_of_branches', 'membership_duration',
];

const EXPERT_PROFILE_FIELDS = [
  'name_of_the_person', 'email', 'telephone_mobile', 'date_of_birth',
  'specialty', 'field_of_expertise', 'specialisation_on_selected_field',
  'years_of_experience', 'short_description', 'any_other_details',
  'consultation_fee', 'continent', 'country', 'membership_duration',
];

const PROFILE_FIELDS_MAP = {
  company: COMPANY_PROFILE_FIELDS,
  investor: INVESTOR_PROFILE_FIELDS,
  expert: EXPERT_PROFILE_FIELDS,
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
    const body = ctx.request.body;
    const { user_type, display_name } = body;

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
    const missing = required.filter((field) => !body[field]);
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

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        customAllowedKeys,
        isArray(register?.allowedFields) ? register.allowedFields : []
      )
    );

    // Build user params
    const params = {
      ..._.pick(body, allowedKeys),
      provider: 'local',
    };

    const validations = strapi.config.get('plugin::users-permissions.validationRules');

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
      display_name: display_name || body.name_of_the_person || username,
      subscription_status: 'free',
    };

    const user = await getService('user').add(newUser);

    // Build profile data from allowed fields for this user_type
    const allowedProfileFields = PROFILE_FIELDS_MAP[user_type];
    const profileData = _.pick(body, allowedProfileFields);

    // Add owner relation for company
    if (user_type === 'company') {
      profileData.owner = user.id;
    }

    // Create the profile entry
    const apiMap = {
      company: 'api::company.company',
      investor: 'api::investor.investor',
      expert: 'api::expert.expert',
    };

    await strapi.documents(apiMap[user_type]).create({ data: profileData });

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
