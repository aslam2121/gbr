import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      register: {
        allowedFields: [
          'user_type',
          'display_name',
          'company_name',
          'investor_name',
          'expert_name',
          'specialty',
        ],
      },
    },
  },
});

export default config;
