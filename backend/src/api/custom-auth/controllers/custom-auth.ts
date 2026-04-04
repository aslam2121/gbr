'use strict';

const _ = require('lodash');

const VALID_USER_TYPES = ['company', 'investor', 'expert'];

// Sanitize string input to prevent XSS
function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/[<>]/g, '').trim();
  }
  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitize(value);
  }
  return result;
}

const PROFILE_FIELDS = [
  'continent', 'name_of_the_person', 'email', 'telephone_mobile',
  'short_description', 'membership_duration',
  'name_of_the_company', 'foundation_year', 'country',
  'location_of_headquarters', 'location_of_branches',
  'area_of_specification', 'requirements_for_partnership', 'existing_partners',
  'type_of_investor', 'investment_policies', 'eligibility_criteria',
  'date_of_birth', 'field_of_expertise', 'specialisation_on_selected_field',
  'years_of_experience', 'work_experience_description', 'consultation_fee',
  'any_other_details',
];

export default {
  async register(ctx) {
    const body = ctx.request.body;
    const { username, email, password, user_type, display_name } = body;

    // Validate required fields
    if (!email || !password || !username) {
      return ctx.badRequest('Missing required fields: email, password, username');
    }

    if (!user_type || !VALID_USER_TYPES.includes(user_type)) {
      return ctx.badRequest(`Invalid user_type. Must be one of: ${VALID_USER_TYPES.join(', ')}`);
    }

    // Check for existing user
    const existingUser = await strapi.db.query('plugin::users-permissions.user').count({
      where: {
        $or: [
          { email: email.toLowerCase() },
          { username },
        ],
      },
    });

    if (existingUser > 0) {
      return ctx.badRequest('Email or Username are already taken');
    }

    // Get default role
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const settings = await pluginStore.get({ key: 'advanced' }) as { default_role: string };

    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      return ctx.badRequest('Could not find default role');
    }

    // Create user with sanitized fields
    const user = await strapi.plugin('users-permissions').service('user').add({
      username: sanitize(username) as string,
      email: email.toLowerCase().trim(),
      password,
      provider: 'local',
      role: role.id,
      confirmed: true,
      user_type,
      display_name: sanitize(display_name || username) as string,
      subscription_status: 'free',
    });

    // Create user-profile with sanitized profile fields
    const profileFields = sanitizeObject(_.pick(body, PROFILE_FIELDS));
    try {
      await strapi.documents('api::user-profile.user-profile').create({
        data: {
          ...profileFields,
          owner: user.id,
        },
      });
    } catch (err) {
      strapi.log.error('Failed to create user profile:', err);
    }

    // Issue JWT
    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });

    // Sanitize user output
    const userSchema = strapi.getModel('plugin::users-permissions.user');
    const sanitizedUser = await strapi.contentAPI.sanitize.output(user, userSchema, { auth: ctx.state.auth });

    return ctx.send({ jwt, user: sanitizedUser });
  },
};
