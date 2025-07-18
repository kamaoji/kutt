//
// server/env.js
// --- CORRECTED FOR RENDER DEPLOYMENT ---
//

const { str, num, cleanEnv, url } = require('envalid');
const { version } = require('../package.json');

const env = cleanEnv(process.env, {
  // We will now directly use process.env to read from Render
  // and only provide defaults for local development.

  // --- Core Application Settings ---
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'production', // Default to production for Render
  }),
  PORT: num({
    default: 3000,
    desc: 'The port to run the server on',
  }),
  HOST: str({
    default: '0.0.0.0', // Important for hosting services like Render
    desc: 'The host to run the server on',
  }),
  // --- Database Connection ---
// This is the most important change. It will now read directly from Render's DATABASE_URL.
DATABASE_URL: url({
  desc: 'The connection string for the PostgreSQL database',
}),
// NEW LINE: Add a validator for the DB_CLIENT variable provided by Render
DB_CLIENT: str({ default: 'postgres' }),

  // --- Security Keys ---
  // These MUST be set in Render's environment variables. We remove defaults to ensure security.
  SECRET_KEY_BASE: str({
    desc: 'A long, random, secret key used for security functions (at least 32 characters)',
  }),

  // --- Kutt.it Specific Settings ---
  // This must be your public Render URL.
  NEXT_PUBLIC_SITE_URL: url({
    desc: 'The public URL of your Kutt.it instance (e.g., https://my-kutt.onrender.com)',
  }),
  RECAPTCHA_SITE_KEY: str({ default: '' }), // Optional, leave blank if not using
  RECAPTCHA_SECRET_KEY: str({ default: '' }), // Optional, leave blank if not using
  GOOGLE_SAFE_BROWSING_KEY: str({ default: '' }), // Optional, leave blank if not using

  // --- Admin User Setup ---
  // These will be used to create the first admin user if one doesn't exist.
  ADMIN_EMAIL: str({
    desc: 'The email address for the default admin user',
  }),
  ADMIN_PASSWORD: str({
    desc: 'The password for the default admin user',
  }),

  // --- Optional Settings (These can usually be left as default) ---
  NON_USER_COOLDOWN: num({ default: 1000 * 60 }), // Cooldown for non-users in ms
  USER_COOLDOWN: num({ default: 0 }), // Cooldown for logged-in users in ms
  DEFAULT_MAX_STATS_PER_LINK: num({ default: 20000 }),
  LINK_LENGTH: num({ default: 7 }),

  // --- SMTP Mailer Settings (Optional) ---
  // For features like "Forgot Password". Leave these blank if not setting up email.
  MAILER_HOST: str({ default: '' }),
  MAILER_PORT: num({ default: 587 }),
  MAILER_USER: str({ default: '' }),
  MAILER_PASS: str({ default: '' }),
  MAILER_SENDER: str({ default: 'no-reply@kutt.it' }),

  // --- Version (Read from package.json) ---
  VERSION: str({ default: version }),
});

module.exports = env;
